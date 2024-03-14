import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { routes } from './app.routes';
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";

import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ApiService } from "./services/api.service";

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
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {  }
