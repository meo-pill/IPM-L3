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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    //this.fetchInfos('25544');
  }


  fetchInfos(req :string): void {
    let alive = true;
    this.apiService.GetInfos(req)

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
              return this.fetchInfos(req);
            }
            return this.Infos.positions[i % this.Infos.positions.length];
          })
        );
      });
  }

  // Rechercher un satellite sur le site du catalogue Celestrak
  search(): void{
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
