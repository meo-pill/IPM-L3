import { Routes } from "@angular/router";
import { CompoTestComponent } from "./components/compo-test/compo-test.component";
import { FooterComponent } from "./components/footer/footer.component";

export const routes: Routes = [
    // Define your routes here
    // { path: '', component: YourComponent },
    { path: 'header', component: CompoTestComponent },
    { path: 'footer', component: FooterComponent}
];

