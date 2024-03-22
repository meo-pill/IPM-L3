import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
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
  positions$: Observable<any> | undefined; // Itérateur sur les positions du satellite
  searchTerm: string = '';
  searchResult: Array<string> = [];
  description: string = '';
  descInfos: { [key: string]: string } = {
    // 'name': '',
    // 'img': '',
    //
    // 'satId': '',
    // 'noradId': '',
    //
    // 'desc': '',
    // 'names': '',
    // 'site': '',
    // 'origin': '',
    // 'launch': '',
  };


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetch('25544');
  }

  fetch(id: string): void {
    this.fetchInfos(id);
    this.fetchPos(id);
  }


  // Récupérer les données de N2YO
  fetchPos(req: string): void {
    let alive = true;
    this.apiService.getPos(req)

      // Serveur déconnecté, réessayer la connexion
      .pipe(catchError(err => {
        console.error('Server connexion unestablished.\n Attempting to reconnect ...');
        return of(err).pipe(delay(5000), switchMap(() => throwError(err))); // Throw the error after the delay
      }), retry())

      // Serveur connecté, récupérer les données
      .subscribe(res => {
        this.Infos = res;
        this.positions$ = interval(1000)

          // Itérer sur les données récupérées et envoyer la nouvelle ligne chaque seconde
          .pipe(takeWhile(() => alive),
            map(i => {
              // Fin de boucle : recommencer le procédé
              if (i % this.Infos.positions.length === this.Infos.positions.length - 1) {
                alive = false;
                return this.fetchPos(req);
              }
              return this.Infos.positions[i % this.Infos.positions.length];
            })
          );
      });
  }

  // Récupérer description & image du satellite
  fetchInfos(id: string): void {
    this.apiService.getInfos(id)

      .pipe(catchError(err => {
        console.error();
        return of(err).pipe(delay(5000), switchMap(() => throwError(err))); // Throw the error after the delay
      }), retry())

      .subscribe(res => {
        let json = JSON.parse(JSON.stringify(res));
        this.descInfos = {};
        if (json['name'] != "") {
          this.descInfos['name'] = json['name'];
          if (json['names'] != "") this.descInfos['names'] = json['names'];
          this.descInfos['img'] = json['image'] == "" ? "assets/img/sat_default.png" : 'https://db-satnogs.freetls.fastly.net/media/' + json['image'];
          this.descInfos['noradId'] = json['norad_cat_id'];
          this.descInfos['satId'] = json['sat_id'];
          this.descInfos['status'] = json['status'];
          if (json['launched'] != null) this.descInfos['launch'] = json['launched'];
          if (json['countries'] != "") this.descInfos['origin'] = json['countries'];
          if (json['website'] != "") this.descInfos['site'] = json['website'];
        }
        if (!json['citation'].includes("CITATION NEEDED") && json['citation'] !== "") this.descInfos['description'] = json['citation'];
      });
  }

  // Rechercher un satellite sur le site du catalogue Celestrak
  search(): void {
    this.apiService.getNames(this.searchTerm)
      .subscribe(res => {

        // Récupérer une liste des noms de satellites + ID NORAD via scrapping
        this.searchResult = res.split('<tbody>')[1].split('</tbody>')[0].split('</tr>').slice(0, 11);
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
