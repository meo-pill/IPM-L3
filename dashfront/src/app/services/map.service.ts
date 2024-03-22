import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private source = new BehaviorSubject('start');
  currentPosition = this.source.asObservable();

  constructor() { }

  changePosition(nouvellePosition: Observable<any>) {
    this.currentPosition = nouvellePosition;
  }
}
