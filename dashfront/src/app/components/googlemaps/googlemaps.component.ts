import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MapService } from '../../services/map.service';
import { Observable, interval, of, Subscription, takeWhile } from 'rxjs';
import { map, catchError, delay, switchMap, retry } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from "../../services/event.service";

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

  constructor(private mapService: MapService, private eventService: EventService) {
    interval(500).pipe(
      takeWhile(() => true)).
      subscribe(async () => {
        //console.log("fetchCompleted: " + EventService.fetchCompleted)
        if (EventService.fetchCompleted) {
          //console.log('fetchCompleted received')
          this.Infos = MapService.getPos();
          EventService.fetchCompleted = false;
          //console.log('fetchCompleted end')
        }
      });
  }

  Infos: any[] = [];

  async ngOnInit(): Promise<void> {
    this.initMap();
  }

  async ngAfterViewInit(): Promise<void> {

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

      var markers: google.maps.Marker[];

      positions$ = interval(1000)
        .pipe(map(index => {

          markers = this.Infos.map((info) =>
            new google.maps.Marker({
              icon: imageSatellite,
              map: myMap,
              title: info.info.name
            })
          );

          for (let i = 0; i < this.Infos.length; i++) {
            if (index % this.Infos[i].positions.length === this.Infos[i].positions.length - 1) {
              EventService.fetchNewPos = true; // Emit the event here
              console.log('fetchNewPos emitted in GooglemapsComponent');
              positions$.unsubscribe();

              positions$ = interval(1000)
                .pipe(map(index => {
                  latlng = new google.maps.LatLng(this.Infos[i].positions[index % this.Infos[i].positions.length].satlatitude, this.Infos[i].positions[index % this.Infos[i].positions.length].satlongitude);
                  markers[i].setPosition(latlng);
                })).subscribe();
            } else {
              latlng = new google.maps.LatLng(this.Infos[i].positions[index % this.Infos[i].positions.length].satlatitude, this.Infos[i].positions[index % this.Infos[i].positions.length].satlongitude);
              markers[i].setPosition(latlng);
            }
          }
        })).subscribe();
    });
  }
}
