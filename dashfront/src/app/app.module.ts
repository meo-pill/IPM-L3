import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { routes } from './app.routes';
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";

import { HttpClientModule } from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { _HttpClient } from

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    HeaderComponent
  ],
  providers: [_HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
