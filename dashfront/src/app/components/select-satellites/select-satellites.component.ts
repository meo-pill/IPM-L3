import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ApiService } from "../../services/api.service";
import { CommonModule } from "@angular/common";
import {async, delay, interval, Observable, of, pipe, retry, retryWhen, switchMap, takeWhile, throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule } from "@angular/forms";
import { MapService } from '../../services/map.service';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-select-satellites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './select-satellites.component.html',
  styleUrl: './select-satellites.component.scss'
})

export class SelectSatellitesComponent implements OnInit {
  Pos: any = []; // Première requête à celestrak
  positions$: Observable<any> | undefined; // Itérateur sur les positions du satellite
  searchTerm: string = '';
  searchResult: Array<string> = [];
  description: string = '';
  descInfos: { [key: string]: string } = {};

  cacheInfos: any[] = [];
  cachePos: any[] = [];


  constructor(private apiService: ApiService, private mapService: MapService, private eventService: EventService) {
    interval(500).pipe(
    takeWhile(() => true)).
    subscribe( async () => {
      if (EventService.fetchNewPos) {
        console.log('fetchNewPos received')
        for (let i = 0; i < this.cachePos.length; i++) {
          let id = this.cachePos[i].info.satId;
          const pos = await this.fetchPos(id).toPromise();
          if (pos && !this.cachePos.some(cachedPos => cachedPos.info.satid === pos['info'].satid)) {
            this.cachePos[i] = pos;
          }
        }
      }
    });
  }




  ngOnInit(): void {
    this.fetch('25544');
  }


  async fetch(id: string): Promise<void> {
    try {
      const info = await this.fetchInfos(id).toPromise();
      if (info && !this.cacheInfos.some(cachedInfo => cachedInfo.norad_cat_id === info['noradId'])) {
        this.cacheInfos.push(info);
      }

      const pos = await this.fetchPos(id).toPromise();
      if (pos && !this.cachePos.some(cachedPos => cachedPos.info.satid === pos['info'].satid)) {
        this.cachePos.push(pos);
      }

      if (this.cachePos.length > 5) {
        this.cachePos.shift();
        this.cacheInfos.shift();
      }

      MapService.updatePos(this.cachePos);

      EventService.fetchNewPos = false
      console.log('fetchNewPos end')

      EventService.fetchCompleted = true;
      console.log('fetchCompleted emitted');

    } catch (error) {
      console.error(error);
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
