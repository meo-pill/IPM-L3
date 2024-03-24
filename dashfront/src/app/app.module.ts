import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ApiService } from "./services/api.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { GooglemapsComponent } from "./components/googlemaps/googlemaps.component";
import { GoogleMapsModule } from "@angular/google-maps";
import { SelectSatellitesComponent } from "./components/select-satellites/select-satellites.component";
import { FooterComponent } from "./components/footer/footer.component";
import { routes } from './app.routes';

@NgModule({
    declarations: [
    ],
    imports: [
      HeaderComponent,
      GooglemapsComponent,
      FooterComponent,
      SelectSatellitesComponent,
      BrowserModule,
      RouterModule.forRoot(routes),
      HttpClientModule,
      GoogleMapsModule
    ],
    providers: [ApiService],
})
export class AppModule { }
