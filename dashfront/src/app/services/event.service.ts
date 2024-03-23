import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  public static fetchCompleted: boolean = false;
  public static fetchNewPos: boolean = false;
}
