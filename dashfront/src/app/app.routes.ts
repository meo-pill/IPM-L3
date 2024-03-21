import { Routes } from "@angular/router";
import { CompoTestComponent } from "./components/compo-test/compo-test.component";
import {HeaderComponent} from "./components/header/header.component";


export const routes: Routes = [
    // Define your routes here
    // { path: '', component: YourComponent },
    { path: 'header', component: CompoTestComponent }
    { path: 'header', component: HeaderComponent }
];

