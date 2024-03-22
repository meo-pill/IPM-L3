import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  Infos: any = [];

  constructor() { }

  updatePos(info: any[]){
    this.Infos = info;
    console.log(this.Infos);
  }

  getPos(): any[] {
    console.log(this.Infos);
    return this.Infos;
  }
}
