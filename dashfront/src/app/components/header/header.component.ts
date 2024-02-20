import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  Infos:any = [];

  constructor(private apiService: ApiService) {  }

  ngOnInit(): void {
    this.apiService.GetInfos().subscribe(res => {
      console.log(res);
      this.Infos = res;
    });
  }
}
