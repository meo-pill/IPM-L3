import { Routes } from "@angular/router";
import { GooglemapsComponent } from "./components/googlemaps/googlemaps.component";
import { SelectSatellitesComponent } from "./components/select-satellites/select-satellites.component";


export const routes: Routes = [
    // Define your routes here
    // { path: '', component: YourComponent },
    { path: 'select', component: SelectSatellitesComponent },
    { path: 'map', component: GooglemapsComponent }
];

