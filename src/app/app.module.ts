import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { AccueilComponent } from './accueil/accueil.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './service/auth/auth.service';
import { 
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatCardModule,
  MatTabsModule,
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
  MatExpansionModule,
  MatSliderModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from "@ag-grid-community/angular";
import { AgGridComponent } from './stock/stock.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { PricingComponent } from './pricing/pricing.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { AuthGuard } from './service/auth/auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: AccueilComponent
  },
  {
    path: 'news',
    canActivate: [AuthGuard],
    component: NewsComponent
  },
  {
    path: 'portfolio',
    canActivate: [AuthGuard],
    component: PortfolioComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'stock/:id',
    canActivate: [AuthGuard],
    component: AgGridComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    AccueilComponent,
    LoginComponent,
    RegisterComponent,
    AgGridComponent,
    PricingComponent,
    PortfolioComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AgGridModule,
    MatGridListModule,
    MatExpansionModule,
    NgxBootstrapSliderModule,
    MatSliderModule
  ],
  providers: [ MatDatepickerModule, AuthService, AuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
