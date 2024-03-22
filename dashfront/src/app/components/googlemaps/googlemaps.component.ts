import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MapService } from '../../services/map.service';
import { Observable, interval, of, Subscription } from 'rxjs';
import { map, catchError, delay, switchMap, retry } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

let myMap: google.maps.Map, infoWindow: google.maps.InfoWindow;
let Infos: any[] = [];

const loader = new Loader({
  apiKey: "AIzaSyD4FY5MdRbUhjsHQDETMaQ_gX3T0tADyCE",
  version: "weekly",
  libraries: ["places"]
});

function handleLocationError(
  browserHasGeolocation: boolean,
  infoWindow: google.maps.InfoWindow,
  pos: google.maps.LatLng
) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(myMap);
}

let mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 2
};

function initMap(fetchNewInfos: EventEmitter<void>) {
  loader.load().then((google) => {
    let positions$: Subscription;
    var latlng = new google.maps.LatLng(0, 0);
    var imageSatellite = {
      url: "https://static.thenounproject.com/png/5350-200.png", // url
      scaledSize: new google.maps.Size(50, 50) // size
    };
    myMap = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      mapOptions
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
            handleLocationError(true, infoWindow, myMap.getCenter()!);
          }
        );
      } else {
        handleLocationError(false, infoWindow, myMap.getCenter()!);
      }
    });

    const markers: google.maps.Marker[] = Infos.map((info) =>
      new google.maps.Marker({
        position: latlng,
        map: myMap,
        icon: imageSatellite,
        title: info.info.name,
      })
    );

    positions$ = interval(1000)
      .pipe(map(index => {
        for (let i = 0; i < Infos.length; i++) {
          if (index % Infos[i].position.length === Infos[i].position.length - 1) {
            fetchNewInfos.emit();
            positions$.unsubscribe();
            positions$ = interval(1000)
              .pipe(map(index => {
                latlng = new google.maps.LatLng(Infos[i].position[index % Infos[i].position.length].lat, Infos[i].position[index % Infos[i].position.length].lng);
                markers[i].setPosition(latlng);
              })).subscribe();
          } else {
            latlng = new google.maps.LatLng(Infos[i].position[index % Infos[i].position.length].lat, Infos[i].position[index % Infos[i].position.length].lng);
            markers[i].setPosition(latlng);
          }
        }
      })).subscribe();
  });
}

declare global {
    interface Window {
    initMap: (fetchNewInfos: EventEmitter<void>) => void;
  }
}

window.initMap = initMap;

@Component({
  selector: 'app-googlemaps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [MapService],
  templateUrl: './googlemaps.component.html',
  styleUrl: './googlemaps.component.scss'
})

export class GooglemapsComponent implements OnInit {
  @Output() fetchNewPos = new EventEmitter<void>();

  constructor(private mapService: MapService) { }

  async waitInfos(timeout = 5000) {
    const interval = 100;
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (this.mapService.getPos() !== null) {
          clearInterval(timer);
          resolve(true);
        }
        timeout -= interval;
        if (timeout <= 0) {
          clearInterval(timer);
          reject(new Error('Timed out waiting for Infos'));
        }
      }, interval);
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.waitInfos();
      Infos = this.mapService.getPos();
      initMap(this.fetchNewPos);
      this.fetchNewPos.subscribe(() => {
        Infos = this.mapService.getPos();
        if (Infos.length > 0) {
          initMap(this.fetchNewPos);
        }
        console.log(Infos);
      });
    } catch (error) {
      console.error(error);
    }
  }
}
