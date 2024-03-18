import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-compo-test',
  standalone: true,
  imports: [],
  templateUrl: './compo-test.component.html',
  styleUrl: './compo-test.component.scss'
})
export class CompoTestComponent implements OnInit {
  Infos: any = [];

  constructor(private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.apiService.GetInfos()
      .subscribe(res => {
        console.log(res);
        this.Infos = res;
      });
  }
}