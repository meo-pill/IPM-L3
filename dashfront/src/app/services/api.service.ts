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

  GetInfos(id: string) {
    console.log('GetInfos');
    return this.httpClient.get(`${this.REST_API}/${id}`);
  }

  getNames(searchTerm: string) {
    const url = `https://celestrak.org/NORAD/elements/table.php?NAME=${searchTerm}`;
    return this.httpClient.get(url, {responseType: 'text'});
  }
}
