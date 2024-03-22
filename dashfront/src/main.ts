import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import { HeaderComponent } from './app/header/header.component';
import { GooglemapsComponent } from './app/components/googlemaps/googlemaps.component';
import { SelectSatellitesComponent } from './app/components/select-satellites/select-satellites.component';
import { FooterComponent } from './app/components/footer/footer.component';

bootstrapApplication(HeaderComponent, appConfig)
  .catch((err) => console.error(err));

bootstrapApplication(GooglemapsComponent, appConfig)
  .catch((err) => console.error(err));

bootstrapApplication(SelectSatellitesComponent, appConfig)
  .catch((err) => console.error(err));

bootstrapApplication(FooterComponent, appConfig)
  .catch((err) => console.error(err));
