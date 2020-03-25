import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import {MatGridListModule} from '@angular/material/grid-list';
import { AuthService } from './service/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService]
})
export class AppComponent implements OnInit {

  title = 'pfe-prisma';
  constructor(private router: Router,
    private authService: AuthService) { }

  objectOptions = [
    { name: 'Airbus', shortName: 'air'},
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

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  getUserName() {
    return this.authService.getUser().name;
  }

  logout() {
    return this.authService.logout();
  }

  isLogged(){
    return this.authService.isLogged();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    var names = this.objectOptions.filter( data => {
      return data.name;
    }).map(function(el) {
      return el.name;
    });
    return names.filter(option => 
      option.toLowerCase().startsWith(filterValue, 0)
    );
  }

  displayFn(subject){
    return subject ? subject : undefined;
  }

  onSubmit(form: NgForm){
    var choices = this.objectOptions.filter( data => {
      return data.name;
    }).map(function(el) {
      return el;
    });
    var choice = choices.filter(option => 
      option.name.startsWith(this.myControl.value, 0)
    );

    var id = choice.filter(data => {
      return data.shortName
    }).map(function(el) {
      return el.shortName;
    });

    if(choice.length > 0){
      this.myControl.setValue('');
      this.router.navigate(['stock', id[0]]);
    }
  }
}