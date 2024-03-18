import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {CommonModule} from "@angular/common";
import {delay, interval, Observable, of, retry, retryWhen, switchMap, takeWhile, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {
  Infos:any = []; // Première requête à celestrak
  positions$: Observable<any> | undefined; // Seconde requête à N2YO
  searchTerm: string = '';
  searchResult: Array<string> = [];
  descInfos: {[key: string] : string} = {
    // 'name': '',
    // 'desc': '',
    // 'img': '',
    //
    // 'satId': '',
    // 'noradId': '',
    //
    // 'alt': '',
    // 'site': '',
    // 'origin': '',
    // 'launch': '',
  };


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchPos('25544');
  }

  fetch(id: string) :void {
    this.fetchInfos(id);
    this.fetchPos(id);
  }


  // Récupérer les données de N2YO
  fetchPos(req :string): void {
    let alive = true;
    this.apiService.getPos(req)

      // Serveur déconnecté, réessayer la connexion
      .pipe(catchError(err => {
          console.error('Server connexion unestablished.\n Attempting to reconnect ...');
          return of(err).pipe(delay(5000), switchMap(() => throwError(err))); // Throw the error after the delay
        }),retry())

      // Serveur connecté, récupérer les données
      .subscribe(res => {
        console.log(res);
        this.Infos = res;
        this.positions$ = interval(1000)

          // Itérer sur les données récupérées et envoyer la nouvelle ligne chaque seconde
          .pipe(takeWhile(() => alive),
          map(i => {
            // Fin de boucle : recommencer le procédé
            if (i % this.Infos.positions.length === this.Infos.positions.length - 1) {
              console.log('Reached the end of the table');
              alive = false;
              return this.fetchPos(req);
            }
            return this.Infos.positions[i % this.Infos.positions.length];
          })
        );
      });
  }

  // Récupérer description & image du satellite
  fetchInfos(id: string) :void {
    this.apiService.getInfos(id).subscribe( res => {
      this.descInfos = {};
      let buffer = res.split('            Mission information\n' + '          </div>\n' + '          <div class="card-body">\n' + '            <dl class="row">\n')[1]
        .split('            </dl>\n' + '          </div>\n' + '        </div>\n' + '        <!-- Satellite Status -->')[0];

      let lines = buffer.split('\n');

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<dt class="col-sm-5"')) {
          let key = lines[i].split('>')[1].split('<')[0];
          let value = lines[i+1].split('>')[1].split('<')[0];
          this.descInfos[key] = value;
        }
        if (lines[i].includes('Countries of Origin')) {
          let countries = lines[i+1].match(/<span class="mb-0">(.+?)<\/span>/g);
          if (countries) {
            this.descInfos['Countries of Origin'] = countries.map(country => country.split('>')[1].split('<')[0]).join(' | ');
          }
        }
      }

      console.log(this.descInfos);

    });
  }

  // Rechercher un satellite sur le site du catalogue Celestrak
  search(): void{
    this.apiService.getNames(this.searchTerm)
      .subscribe(res => {

        // Récupérer une liste des noms de satellites + ID NORAD via scrapping
        this.searchResult = res.split('<tbody>')[1].split('</tbody>')[0].split('</tr>').slice(0,11);
        this.searchResult.pop();

        // Nettoyer les données
        for (let i = 0; i < this.searchResult.length; i++) {
            let buffer = this.searchResult[i].split("</td>")[1].split("</a>")[0];
            buffer = '[' + buffer.split('>')[buffer.split('>').length - 1] + '] ';
            buffer += this.searchResult[i].split("</td>")[2].split('>')[1].split('<a')[0];
            this.searchResult[i] = buffer;
        }
      });
  }
}
