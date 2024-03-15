import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {CommonModule} from "@angular/common";
import {delay, interval, Observable, of, retry, retryWhen, switchMap, takeWhile, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ApiService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit {
  Infos:any = []; // Première requête à celestrak
  positions$: Observable<any> | undefined; // Seconde requête à N2YO
  searchTerm: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchInfos('25544');
  }


  fetchInfos(req :string): void {
    let alive = true;
    this.apiService.GetInfos(req)

      .pipe(catchError(err => {
          console.error('Server connexion unestablished.\n Attempting to reconnect ...');
          return of(err).pipe(delay(5000), switchMap(() => throwError(err))); // Throw the error after the delay
        }),retry())

      .subscribe(res => {
        console.log(res);
        this.Infos = res;
        this.positions$ = interval(1000)

          .pipe(takeWhile(() => alive),
          map(i => {
            if (i % this.Infos.positions.length === this.Infos.positions.length - 1) {
              console.log('Reached the end of the table');
              alive = false;
              return this.fetchInfos(req);
            }
            return this.Infos.positions[i % this.Infos.positions.length];
          })
        );
      });
  }

  search(): void{
    this.apiService.getNames(this.searchTerm)
      .subscribe(res => {
        console.log(res);
        this.Infos = res;
      });
  }
}
