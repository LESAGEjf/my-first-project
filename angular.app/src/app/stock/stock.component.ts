import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { IDonnees } from '../api/donnee.js';
import { HttpClient } from "@angular/common/http";
import { Chart } from 'chart.js';
import { AllModules, Module } from "@ag-grid-enterprise/all-modules";
import * as moment from 'moment';
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class AgGridComponent implements OnInit {

  choix = 'air';
  minDate = new Date(2000, 1, 1);
  maxDate = new Date(2020, 1, 1);
  
  datas;

  objectOptions = [
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

  private gridApi;
  private _title;
  private gridOptions;
  private autoGroupColumnDef;
  public modules: Module[] = AllModules;

  private columnDefs;
  public rowData;

  private _previousUrl: string = "http://127.0.0.1:5000/query";
  private _url: string;

  public date = [];
  public open = [];
  public chart = [];

  @Input() Date1: string;
  @Input() Date2: string;

  onGridReady($event) {
    console.log($event);
  }

  setupAgGrid() {
    this.columnDefs = [
      {
        headerName: "Date",
        field: "Date",
        sortable: true,
        filter: true,
        width: 92,
      },
      {
        headerName: "Open",
        field: "Open",
        sortable: true,
        filter: true,
        width: 90,
      },
      {
        headerName: "High",
        field: "High",
        sortable: true,
        filter: true,
        width: 90,
      },
      {
        headerName: "Low",
        field: "Low",
        sortable: true,
        filter: true,
        width: 90,
      },
      {
        headerName: "Close",
        field: "Close",
        sortable: true,
        filter: true,
        width: 90,
      },
      {
        headerName: "Adj Close",
        field: "Adj Close",
        sortable: true,
        filter: true,
        width: 100,
      },
      {
        headerName: "Volume",
        field: "Volume",
        sortable: true,
        filter: true,
        width: 90,
      }
    ];

    this.autoGroupColumnDef = {
      headerName: "Group",
      width: 200,
      field: 'athlete',
      valueGetter: function (params) {
        if (params.node.group) {
          return params.node.key;
        } else {
          return params.data[params.colDef.field];
        }
      },
      headerCheckboxSelection: true,
      // headerCheckboxSelectionFilteredOnly: true,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true
      }
    };
    this.gridOptions = {
      defaultColDef: {
        editable: true,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        resizable: true,
        filter: true
      },
      rowModelType: 'serverSide',
      suppressRowClickSelection: true,
      groupSelectsChildren: true,
      debug: true,
      rowSelection: 'multiple',
      rowGroupPanelShow: 'always',
      pivotPanelShow: 'always',
      enableRangeSelection: true,
      columnDefs: this.columnDefs,
      paginationAutoPageSize: true,
      pagination: true,
      autoGroupColumnDef: this.autoGroupColumnDef,
    };


  }

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.setupAgGrid();

    this.Date1 = "2018-01-01";
    this.Date2 = "2019-01-01";
  }

  onBtnExport() {
    var params = { Date: true };
    this.gridApi.exportDataAsCSV(params);
    document.querySelector("#csvResult").getAttribute = this.gridApi.getDataAsCsv(params);
  }


  getData() {
    return this.http.get(this._url);
  }

  ngOnInit() {
    let value;
    this.route.params.subscribe((e) => value = e);
    this.choix = value['id'];
    this._url = this._previousUrl + "?asset=" + this.choix;
    this.getChart(this.chart);
    this.getData().subscribe(data => {
        this.rowData = data['Prices']
        this.datas = data['Data'];
        console.log(this.datas)
    });
    this._title = this.getTitle();
  }
  getTitle() {
    let x;
    this.route.params.subscribe((e) => x = e);

    var choices = this.objectOptions.filter(data => {
      return data.shortName;
    }).map(function (el) {
      return el;
    });

    var choice = choices.filter(option =>
      option.shortName.includes(x['id'])
    );

    var title = choice.filter(data => {
      return data.name
    }).map(function (el) {
      return el.name;
    });

    return title[0];
  }

  ngDoCheck() {
    let value;
    this.route.params.subscribe((e) => value = e);
    if (this.choix != value['id']) {
      this.choix = value['id'];
      this._url = this._previousUrl + "?asset=" + this.choix + "&dateBegin=" + this.Date1 + "&dateEnd=" + this.Date2;
      this.destroyChart(this.chart);
      this.getChart(this.chart);
      this.rowData.length = 0;
      this.getData().subscribe(data => this.rowData = data['Prices']);
      this._title = this.getTitle();
    }
  }

  onSendDate() {
    this.Date1 = moment(this.Date1).format("YYYY-MM-DD");
    this.Date2 = moment(this.Date2).format("YYYY-MM-DD");
    this._url = this._previousUrl + "?asset=" + this.choix + "&dateBegin=" + this.Date1 + "&dateEnd=" + this.Date2;
    this.destroyChart(this.chart);
    this.getChart(this.chart);
    this.rowData.length = 0;
    this.getData().subscribe(data => this.rowData = data['Prices']);
  }

  destroyChart(chart: Chart) {
    this.open.length = 0;
    this.open = [];
    this.date.length = 0;
    this.date = [];
    if (this.chart) {
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      });
      chart.update();
    }
    return chart;
  }

  getChart(chart: Chart) {
    this.http.get(this._url).subscribe((res: IDonnees[]) => {
      res['Prices'].forEach(y => {
        this.date.push(y.Date);
        this.open.push(y.Open);
      });

      this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: this.date,
          datasets: [
            {
              data: this.open,
              borderColor: '#3cba9f',
              fill: false
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    });
    return chart;
  }
}
