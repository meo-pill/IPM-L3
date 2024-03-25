import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MapService } from '../../services/map.service';
import { Observable, interval, of, Subscription, takeWhile } from 'rxjs';
import { map, catchError, delay, switchMap, retry } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

let myMap: google.maps.Map, infoWindow: google.maps.InfoWindow;


const loader = new Loader({
  apiKey: "AIzaSyD4FY5MdRbUhjsHQDETMaQ_gX3T0tADyCE",
  version: "weekly",
  libraries: ["places"]
});

@Component({
  selector: 'app-googlemaps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [MapService],
  templateUrl: './googlemaps.component.html',
  styleUrl: './googlemaps.component.scss'
})

export class GooglemapsComponent implements OnInit, AfterViewInit {

  constructor() {
    MapService.setGooglemaps(this);
  }

  fetchCompleted(pos: any[]): void {
      this.Pos = pos
  }

  Pos: any[] = [];
  Markers: google.maps.Marker[] = [];
  async ngOnInit(): Promise<void> {
    this.initMap();
  }

  async ngAfterViewInit(): Promise<void> {

  }

  clearMarkers(): void {
    for (let i = 0; i < this.Markers.length; i++) {
      this.Markers[i].setMap(null);
    }
    this.Markers = [];
  }

  async initMap(): Promise<void> {
    loader.load().then((google) => {
      let positions$: Subscription;
      var latlng = new google.maps.LatLng(0, 0);
      var imageSatellite = {
        url: "https://static.thenounproject.com/png/5350-200.png", // url
        scaledSize: new google.maps.Size(40, 40) // size
      };
      myMap = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: {
            lat: 0,
            lng: 0
          },
          zoom: 2
        }
      );
      infoWindow = new google.maps.InfoWindow();
      const locationButton = document.createElement("button");
      locationButton.textContent = "Voir la position actuelle";
      locationButton.classList.add("custom-map-control-button");
      myMap.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
      locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              infoWindow.setPosition(pos);
              infoWindow.setContent("Vous êtes ici");
              infoWindow.open(myMap);
              myMap.setCenter(pos);
            },
            () => {
              infoWindow.setPosition(myMap.getCenter()!);
              infoWindow.setContent(
                navigator.geolocation
                  ? "Error: The Geolocation service failed."
                  : "Error: Your browser doesn't support geolocation."
              );
              infoWindow.open(myMap);
            }
          );
        } else {
          infoWindow.setPosition(myMap.getCenter()!);
          infoWindow.setContent("Error: Your browser doesn't support geolocation.");
          infoWindow.open(myMap);
        }
      });



      positions$ = interval(1000)
        .pipe(map(index => {

          this.clearMarkers();

          this.Markers = this.Pos.map((info) => {
              let marker = new google.maps.Marker({
                icon: imageSatellite,
                map: myMap,
                title: info.info.satid,
                label: {
                  text: info.info.satname,
                  color: "lightgrey",
                  fontFamily: "Archivo",
                  fontWeight: "bolder",
                  className: "label"
                },
                clickable: true
              })

            marker.addListener("click", () => {
              MapService.markerClicked(info.info.satid);
            });

            return marker;
            }
          );


          for (let i = 0; i < this.Pos.length; i++) {
            if (index % this.Pos[i].positions.length === this.Pos[i].positions.length - 1) {
              MapService.fetchNewPos();

              positions$.unsubscribe();

              positions$ = interval(1000)
                .pipe(map(index => {
                  latlng = new google.maps.LatLng(this.Pos[i].positions[index % this.Pos[i].positions.length].satlatitude, this.Pos[i].positions[index % this.Pos[i].positions.length].satlongitude);
                  this.Markers[i].setPosition(latlng);
                })).subscribe();
            } else {
              latlng = new google.maps.LatLng(this.Pos[i].positions[index % this.Pos[i].positions.length].satlatitude, this.Pos[i].positions[index % this.Pos[i].positions.length].satlongitude);
              this.Markers[i].setPosition(latlng);
            }
          }
        })).subscribe();
    });
  }
}
