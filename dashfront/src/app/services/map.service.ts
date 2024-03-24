import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  static Infos: any = [];

  constructor() { }

  static updatePos(info: any[]){
    this.Infos = info;
  }

  static getPos(): any[] {
    return this.Infos;
  }
}
