import { Routes } from "@angular/router";
import { GooglemapsComponent } from "./components/googlemaps/googlemaps.component";
import { SelectSatellitesComponent } from "./components/select-satellites/select-satellites.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./header/header.component";

export const routes: Routes = [
    // Define your routes here
    // { path: '', component: YourComponent },
    { path: 'header', component: HeaderComponent },
    { path: 'select', component: SelectSatellitesComponent },
    { path: 'map', component: GooglemapsComponent },
    { path: 'footer', component: FooterComponent}
];

