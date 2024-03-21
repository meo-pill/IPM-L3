import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  REST_API: string = 'http://localhost:3080';
  //REST_API: string = 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json';
  constructor(private httpClient: HttpClient) { }

  getPos(id: string) {
    return this.httpClient.get(`${this.REST_API}/donnees/${id}`);
  }

  getInfos(id: string) {
    return this.httpClient.get(`${this.REST_API}/infos/${id}`);
  }

  getNames(searchTerm: string) {
    const url = `https://celestrak.org/NORAD/elements/table.php?NAME=${searchTerm}&ACTIVE=1&MAX=10`;
    return this.httpClient.get(url, {responseType: 'text'});
  }

  getDesc(id: string) {
    return this.httpClient.get(`${this.REST_API}/satellite/${id}`, {responseType: 'text'});
  }
}
