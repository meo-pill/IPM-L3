import { Routes } from "@angular/router";
import {HeaderComponent} from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

export const routes: Routes = [
    // Define your routes here
    // { path: '', component: YourComponent },
    { path: 'header', component: HeaderComponent }
    { path: 'footer', component: FooterComponent}
];

