import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
//import { CompoTestComponent } from './app/components/compo-test/compo-test.component';
//import { AppComponent } from './app/app.component';
import { GooglemapsComponent } from './app/components/googlemaps/googlemaps.component';


//bootstrapApplication(AppComponent, appConfig)
bootstrapApplication(GooglemapsComponent, appConfig)
  .catch((err) => console.error(err));
