import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { routes } from './app.routes';
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";

import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ApiService } from "./services/api.service";
import { GooglemapsComponent } from "./components/googlemaps/googlemaps.component";
import { GoogleMapsModule } from "@angular/google-maps";
import { SelectSatellitesComponent } from "./components/select-satellites/select-satellites.component";
import { FooterComponent } from "./components/footer/footer.component";


@NgModule({
    declarations: [
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        HeaderComponent,
        GoogleMapsModule,
        FooterComponent
    ],
    providers: [ApiService],
})
export class AppModule { }
