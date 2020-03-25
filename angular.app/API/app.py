from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import pandas as pd
import numpy as np
from pypfopt.efficient_frontier import EfficientFrontier
from pypfopt import risk_models
from pypfopt import expected_returns

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="root",
  database="prisma-pfe"
) 
mycursor = mydb.cursor(buffered=True)

databases = ("show tables")
mycursor.execute(databases)
prices = []
for (databases) in mycursor:
    if "_predicted" in databases[0]:
        prices.append(databases[0])
        
queries = []
for db in prices:
    mycursor.execute("SELECT Predicted FROM " + db)
    myresult = mycursor.fetchall()
    queries.append([x[0] for x in myresult])

priceDf = pd.DataFrame(queries)
priceDf = priceDf.T
priceDf.columns=prices

def getPortfolio(assets, user_risk):
    priceDfFiltered = priceDf[assets]
    mu = expected_returns.mean_historical_return(priceDfFiltered)
    S = risk_models.sample_cov(priceDfFiltered)
    # Optimise for maximal Sharpe ratio
    ef = EfficientFrontier(mu, S)
    maxReturns = max(mu)
    portfoliosToReturn = {}
    raw_weights = ef.min_volatility()
    cleaned_weights = ef.clean_weights()
    for key in cleaned_weights:
        cleaned_weights[key] *= 100
    portfolioResults = ef.portfolio_performance()
    portfolioResultsOrdered = {"Expected annual return" : portfolioResults[0], "Annual volatility" : portfolioResults[1], "Sharpe Ratio" : portfolioResults[2]}
    portfoliosToReturn["Lowest Volatility"] = {"Weights" : cleaned_weights, "Portfolio" : portfolioResultsOrdered}
    minReturns = portfolioResults[0]
    raw_weights = ef.max_sharpe()
    cleaned_weights = ef.clean_weights()
    for key in cleaned_weights:
        cleaned_weights[key] *= 100
    portfolioResults = ef.portfolio_performance()
    portfolioResultsOrdered = {"Expected annual return" : portfolioResults[0], "Annual volatility" : portfolioResults[1], "Sharpe Ratio" : portfolioResults[2]}
    portfoliosToReturn["Best Portfolio"] = {"Weights" : cleaned_weights, "Portfolio" : portfolioResultsOrdered}
    userReturns = (maxReturns - minReturns) * user_risk + minReturns
    raw_weights = ef.efficient_return(userReturns)
    cleaned_weights = ef.clean_weights()
    for key in cleaned_weights:
        cleaned_weights[key] *= 100
    portfolioResults = ef.portfolio_performance()
    portfolioResultsOrdered = {"Expected annual return" : portfolioResults[0], "Annual volatility" : portfolioResults[1], "Sharpe Ratio" : portfolioResults[2]}
    portfoliosToReturn["User Risk"] = {"Weights" : cleaned_weights, "Portfolio" : portfolioResultsOrdered}
    
    return portfoliosToReturn

def getAssetData(asset, dateBegin, dateEnd):
    print("SELECT * FROM `" + asset + "` WHERE Date < " + dateEnd + " AND Date > " + dateBegin)
    mycursor.execute("SELECT * FROM `" + asset + "` WHERE Date < " + dateEnd + " AND Date > " + dateBegin + " ORDER BY Date ASC")
    myresult = mycursor.fetchall()
    AssetData = {}
    query = []
    adjClose = []
    for x in myresult:
        x = list(x)
        entry = {}
        entry["Date"] = str(x[0])
        entry["Open"] = float(x[1])
        entry["High"] = float(x[2])
        entry["Low"] = float(x[3])
        entry["Close"] = float(x[4])
        entry["Adj Close"] = float(x[5])
        entry["Volume"] = int(x[6])
        adjClose.append(float(x[5]))
        query.append(entry)
    AssetData = {}
    AssetData["Data"] = {"Mean" : round(np.nanmean(adjClose), 2), "Min" : round(min(adjClose), 2) if adjClose else 0, "Max" : round(max(adjClose), 2) if adjClose else 0, "Standard Deviation" : round(np.nanstd(adjClose), 2)}
    AssetData["Prices"] = query
    return AssetData

def getUser(mail, password):
    mycursor.execute("SELECT name, mail  FROM `users` WHERE mail = '" + mail +
        "' AND password = PASSWORD('"+password+"')")
    myresult = mycursor.fetchall()
    
    User = {}

    for x in myresult:
        x = list(x)
        User["name"] = str(x[0])
        User["mail"] = str(x[1])
    return User

def addUser(name, mail, password):
    mycursor.execute("INSERT INTO `users`(`name`, `mail`, `password`) VALUES ('"+
        name+"', '"+mail+"', PASSWORD('"+password+"'))")
    
    mydb.commit()

    return mycursor.rowcount


@app.route('/portfolios', methods=['GET'])
def portfolios():
    assets = request.args.get('assets').split(',')
    if request.args.get('user_risk'):
        user_risk = float(request.args.get('user_risk'))
    else :
        user_risk = 0
    Portfolios = getPortfolio(assets, user_risk)
    return jsonify(Portfolios)

@app.route('/query', methods=['GET'])
def query():
    asset = request.args.get('asset')
    if request.args.get('dateEnd'):
        dateEnd = request.args.get('dateEnd').replace("-", "")
    else :
        dateEnd = "20190101"
    print(dateEnd)
    if request.args.get('dateBegin'):
        dateBegin = request.args.get('dateBegin').replace("-", "")
    else :
        dateBegin = "20180101"
    print(dateBegin)
    AssetData = getAssetData(asset, dateBegin, dateEnd)
    print(AssetData["Data"])
    return jsonify(AssetData)

@app.route('/get', methods=['GET'])
def get():
    if request.args.get('mail') :
        userMail = request.args.get('mail')
    else :
        userMail = "personne"
    if request.args.get('password') :
        userPass = request.args.get('password')
    else :
        userPass = "personne"
    User = getUser(userMail, userPass)

    return jsonify(User)

@app.route('/put', methods=['GET'])
def put():
    if request.args.get('name') :
        userName = request.args.get('name')
    else :
        userName = "personne"
    if request.args.get('mail') :
        userMail = request.args.get('mail')
    else :
        userMail = "personne@mail.pays"
    if request.args.get('password') :
        userPass = request.args.get('password')
    else :
        userPass = "root"
    
    row = addUser(userName, userMail, userPass)

    return jsonify({"row": row})

if __name__ == '__main__':
    app.run(debug=True)