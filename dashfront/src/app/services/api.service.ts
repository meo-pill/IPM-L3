import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  REST_API: string = 'http://localhost:3080/donnees';
  //REST_API: string = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json';
  constructor(private httpClient: HttpClient) { }

  getPos(id: string) {
    console.log('GetInfos');
    return this.httpClient.get(`${this.REST_API}/${id}`);
  }

  getInfos(id: string) {
    const url = `https://db.satnogs.org/satellite/${id}`;
    return this.httpClient.get(url, {responseType: 'text'});
  }

  getNames(searchTerm: string) {
    const url = `https://celestrak.org/NORAD/elements/table.php?NAME=${searchTerm}&ACTIVE=1&MAX=10`;
    return this.httpClient.get(url, {responseType: 'text'});
  }
}
