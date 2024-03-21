import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  currentPosition = new Observable<any>();

  constructor() { }

  changePosition(position: Observable<any>) {
    this.currentPosition = position
  }
}
