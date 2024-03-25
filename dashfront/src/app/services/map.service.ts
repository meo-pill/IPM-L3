import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {GooglemapsComponent} from "../components/googlemaps/googlemaps.component";
import {SelectSatellitesComponent} from "../components/select-satellites/select-satellites.component";

@Injectable({
  providedIn: 'root'
})
export class MapService {
  static Googlemaps: GooglemapsComponent | undefined
  static Select: SelectSatellitesComponent | undefined

  static setGooglemaps(googlemaps: GooglemapsComponent): void {
    this.Googlemaps = googlemaps;
  }

  static setSelect(select: SelectSatellitesComponent): void {
    this.Select = select;
  }


  constructor() { }

  static markerClicked(id: string): void {
    this.Select?.markerClicked(id);
  }

  static fetchNewPos(): void {
    this.Select?.fetchNewPos();
  }

  static fetchCompleted(pos: any[]) {
    this.Googlemaps?.fetchCompleted(pos);
  }

}
