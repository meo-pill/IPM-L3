import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  Infos: any = [];

  constructor() { }

  changePosition(newInfos: any) {
    this.Infos = newInfos;
  }
}
