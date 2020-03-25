import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  private _url = 'http://127.0.0.1:5000/portfolios?assets='

  public chartBest = [];
  public chartLow = [];
  public chartRisk = [];

  public titles: string[] = [
    'Best Portfolio',
    'Lowest Volatility',
    'User Risk'
  ];
  public objectOptions = [
    { name: 'Airbus', shortName: 'air' },
    { name: 'Atos', shortName: 'ato' },
    { name: 'Danone', shortName: 'bn' },
    { name: 'BNP Paribas', shortName: 'bnp' },
    { name: 'Carrefour', shortName: 'ca' },
    { name: 'Vinci', shortName: 'dg' },
    { name: 'Bouygues', shortName: 'en' },
    { name: 'TechnipFMC', shortName: 'fti' },
    { name: 'Societe Generale', shortName: 'gle' },
    { name: 'Thales', shortName: 'ho' },
    { name: 'Kering', shortName: 'ker' },
    { name: 'LVMH Moet Hennessy', shortName: 'mc' },
    { name: 'L\'Oreal', shortName: 'or' },
    { name: 'Orange', shortName: 'ora' },
    { name: 'Pernod Ricard', shortName: 'ri' },
    { name: 'Schneider Electric', shortName: 'su' },
    { name: 'Sodexo', shortName: 'sw' },
    { name: 'Total', shortName: 'tot' },
    { name: 'Peugeot', shortName: 'ug' },
    { name: 'Veolia Environnement', shortName: 'vie' }
  ];

  constructor(private http: HttpClient) {
    this.objectOptions.forEach(element => {
      this._url += element.shortName;
      this._url += '_predicted,';
    });
    this._url = this._url.slice(0, -1);
    this._url += "&user_risk=0";
  }

  onInputChange(event) {
    var tmp = event.value / 100;
    this._url = this._url.replace(/(?<=&user_risk=)(.*)/, tmp.toString());
    this.destroyCharts();
    this.getCharts();
  }

  onNgModelChange($event) {
    if (!$event.length) {
      this.objectOptions.forEach(x => {
        $event.push(x.shortName);
      })
    }
    var tmp: string = "";
    $event.forEach(element => {
      tmp += element + "_predicted,"
    });
    tmp = tmp.slice(0, tmp.length - 1);
    this._url = this._url.replace(/(?<=assets=)(.*)(?=&user_risk=)/, tmp);
    this.destroyCharts();
    this.getCharts();
  }

  ngOnInit() {
    this.getCharts();
  }

  getData() {
    return this.http.get(this._url);
  }

   getRandomColor(size) {
        var colors = ["#5899DA", "#E8743B", "#19A979", "#ED4A7B", "#945ECF", "#13A4B4", "#525DF4", "#BF399E", "#6C8893", "#EE6868", "#2F6497", "#f99494", "#f5b04d", "#71c989", "#d5dadc", "#b2d4f5", "#8fd1bb", "#930a0a", "#c67a0c", "#03734d"];
        colors.length = size;
        return colors;
    }  

  getChart(object: Object, name: string) {
    return new Chart(name, {
      type: 'pie',
      data: {
        labels: this.getLabels(object),
        datasets: [
          {
            data: Object.values(object),
            backgroundColor: this.getRandomColor(Object.values(object).length),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        display: true
      }
    });
  }
  
  getIndexesOfZero(objet) {
    return Object.values(objet).map((x: number) => x == 0).findIndex(y => y);
  }

  getKeyOfZero(objet): string {
    return Object.keys(objet).find(
      element => element
    )
  }

  removeZeros(objet) {
    var i = this.getIndexesOfZero(objet);
    while (!(i == -1)) {
      delete objet[Object.keys(objet)[i]];
      i = this.getIndexesOfZero(objet);
    }
    return objet;
  }
bestport;
lowport;
riskport;
  getCharts() {
    this.getData().subscribe(data => {
        this.bestport = data[this.titles[0]]['Portfolio'];
        console.log(this.bestport);
      var best = this.removeZeros(data[this.titles[0]]['Weights']);
      this.chartBest = this.getChart(best, this.titles[0]);
      this.lowport = data[this.titles[1]]['Portfolio'];
      const low = this.removeZeros(data[this.titles[1]]['Weights']);
      this.chartLow = this.getChart(low, this.titles[1]);
      this.riskport = data[this.titles[2]]['Portfolio'];
      const risk = this.removeZeros(data[this.titles[2]]['Weights']);
      this.chartRisk = this.getChart(risk, this.titles[2]);
    });
  }

  destroyChart(chart: Chart) {
    if (chart) {
      chart.data.labels = chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
        chart.data.datasets = dataset.data.pop();
      });
      chart.update();
    }
    return chart;
  }

  destroyCharts() {
    this.chartBest = this.destroyChart(this.chartBest);
    this.chartLow = this.destroyChart(this.chartLow);
    this.chartRisk = this.destroyChart(this.chartRisk);
  }

  onSendStock() {
    console.log('Stock');
  }

  getLabels(object: Object): String[] {
    var labels: String[] = [];
    Object.keys(object).forEach(
      x => {
        x = x.slice(0, x.length - 10);
        labels.push(this.objectOptions.find(
          y => y.shortName == x).name
        );
      }
    );
    return labels;
  }

  getTitle(i: number) {
    return this.titles[i];
  }

  formatLabel(value: number) {
    return value / 100;
  }
}
