import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import { ApiService } from "../../services/api.service";
import { CommonModule } from "@angular/common";
import { delay, interval, Observable, of, retry, retryWhen, switchMap, takeWhile, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule } from "@angular/forms";
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-select-satellites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './select-satellites.component.html',
  styleUrl: './select-satellites.component.scss'
})

export class SelectSatellitesComponent implements OnInit {
  @Input() fetchNewPos: EventEmitter<void> = new EventEmitter<void>();
  Pos: any = []; // Première requête à celestrak
  positions$: Observable<any> | undefined; // Itérateur sur les positions du satellite
  searchTerm: string = '';
  searchResult: Array<string> = [];
  description: string = '';
  descInfos: { [key: string]: string } = {};

  cacheInfos: any[] = [];
  cachePos: any[] = [];


  constructor(private apiService: ApiService, private mapService: MapService) { }

  ngOnInit(): void {
    this.fetch('25544');
    this.mapService.updatePos(this.cachePos);
    console.log(this.mapService.getPos());

    this.fetchNewPos.subscribe(() => {
      for (let i = 0; i < this.cachePos.length; i++) {
        let id = this.cachePos[i].info.satId;
        this.cachePos[i] = this.fetchPos(id)
      }
      this.mapService.updatePos(this.cachePos);
    });
  }

  fetch(id: string): void {
    if (this.cachePos.length <= 5) {
      this.fetchInfos(id).subscribe(info => {
        this.cacheInfos.push(info);
      });
      this.fetchPos(id).subscribe(pos => {
        this.cachePos.push(pos);
        this.fetchNewPos.emit();
      });
    } else {
      alert("Trop de satellites sélectionnés, veuillez en retirer.");
    }
  }


  // Récupérer les données de N2YO
  fetchPos(req: string): Observable<any> {
    return this.apiService.getPos(req)
      .pipe(
        catchError(err => {
          console.error('Server connexion unestablished.\n Attempting to reconnect ...');
          return of(err).pipe(delay(5000), switchMap(() => throwError(err))); // Throw the error after the delay
        }),
        retry(),
        map(res => {
          this.Pos = JSON.parse(JSON.stringify(res));
          return this.Pos;
        })
      );
  }

  // Récupérer description & image du satellite
  fetchInfos(id: string): Observable<{ [p: string]: string }> {
  return this.apiService.getInfos(id)
    .pipe(
      catchError(err => {
        console.error();
        return of(err).pipe(delay(5000), switchMap(() => throwError(err))); // Throw the error after the delay
      }),
      retry(),
      map(res => {
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
        return this.descInfos;
      })
    );
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
