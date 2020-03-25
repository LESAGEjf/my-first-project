import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IArticle } from './article.js';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  private _url: string = "https://api.nytimes.com/svc/topstories/v2/business.json?api-key=kQIGJyQGqndB5Ygs3qzcZqS6QUwYXFXr"
  private _urlSearch: string = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=kQIGJyQGqndB5Ygs3qzcZqS6QUwYXFXr&q=";
  public articles = [];
  public recherches = [];

  @Input() Search: string;

  constructor(private http: HttpClient) { }

  getData(): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(this._url);
  }

  ngOnInit() {
    this.recherches = null;
    this.getData()
      .subscribe(data => this.articles = data);
    console.log(this.articles.length)
  }

  getSearch(): Observable<IArticle[]> {
    this._urlSearch = this._urlSearch + this.Search.replace(/ /g, '+');
    return this.http.get<IArticle[]>(this._urlSearch);
  }

  onSearch() {
    this.articles = null;
    this.getSearch()
      .subscribe(search => this.recherches = search);
  }

}
