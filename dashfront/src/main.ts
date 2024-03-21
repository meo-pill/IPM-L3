import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
//import { CompoTestComponent } from './app/components/compo-test/compo-test.component';
//import { AppComponent } from './app/app.component';
import { GooglemapsComponent } from './app/components/googlemaps/googlemaps.component';
import { HeaderComponent } from "./app/components/header/header.component";
import { FooterComponent } from './app/components/footer/footer.component';

// bootstrapApplication(AppComponent, appConfig)
//    .catch((err) => console.error(err));

bootstrapApplication(GooglemapsComponent, appConfig)
  .catch((err) => console.error(err));
bootstrapApplication(HeaderComponent, appConfig)
  .catch((err) => console.error(err));
bootstrapApplication(FooterComponent, appConfig)
  .catch((err) => console.error(err));
