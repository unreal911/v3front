import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';

registerLocaleData(localeES, 'es');


@NgModule({
  declarations: [
    AppComponent,
    NoPageFoundComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AuthModule,
    PagesModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,



  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
