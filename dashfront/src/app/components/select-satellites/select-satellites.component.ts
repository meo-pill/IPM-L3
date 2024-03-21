import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { MapService } from "../../services/map.service";
import { CommonModule } from "@angular/common";
import { delay, interval, Observable, of, retry, retryWhen, switchMap, takeWhile, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-select-satellites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './select-satellites.component.html',
  styleUrl: './select-satellites.component.scss'
})

export class SelectSatellitesComponent implements OnInit {
  Infos: any = []; // Première requête à celestrak
  positions$: Observable<any> | any; // Seconde requête à N2YO
  searchTerm: string = '';
  searchResult: Array<string> = [];

  constructor(private apiService: ApiService, private mapService: MapService) { }

  ngOnInit(): void {
    this.fetchInfos('25544');
  }

  changeData() {
    this.mapService.changePosition(this.positions$);
  }

  fetchInfos(req: string): void {
    let alive = true;
    this.apiService.getInfos(req)

      // Serveur déconnecté, réessayer la connexion
      .pipe(catchError(err => {
        console.error('Server connexion unestablished.\n Attempting to reconnect ...');
        return of(err).pipe(delay(5000), switchMap(() => throwError(err))); // Throw the error after the delay
      }), retry())

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
                this.fetchInfos(req);
              }
              return this.Infos.positions[i % this.Infos.positions.length];
            })
          );
        this.changeData();
      });

  }



  // Rechercher un satellite sur le site du catalogue Celestrak
  search(): void {
    this.apiService.getNames(this.searchTerm)
      .subscribe(res => {
        // Récupérer une liste des noms de satellites + ID NORAD via scrapping
        this.searchResult = res.split('<tbody>')[1].split('</tbody>')[0].split('</tr>');
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
