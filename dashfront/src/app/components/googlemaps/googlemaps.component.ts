import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { MapService } from '../../services/map.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

let map: google.maps.Map, infoWindow: google.maps.InfoWindow;

let positions$: Observable<any> | any;

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
  infoWindow.open(map);
}


// Paramètres de la carte
let mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 2
};

function initMap() {
  loader.load().then((google) => {
    // Latitude et Longitude du satellite
    var latlng = new google.maps.LatLng(0, 0);

    // Image du repère de satellite
    var imageSatellite = {
      url: "https://static.thenounproject.com/png/5350-200.png", // url
      scaledSize: new google.maps.Size(50, 50) // size
    };

    // Carte
    map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      mapOptions
    );

    infoWindow = new google.maps.InfoWindow();

    const locationButton = document.createElement("button");

    locationButton.textContent = "Voir la position actuelle";
    locationButton.classList.add("custom-map-control-button");

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Vous êtes ici");
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter()!);
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter()!);
      }
    });


    // Repere satellite
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      icon: imageSatellite,
    });

    positions$ = interval(1000)
      // Itérer sur les données récupérées et envoyer la nouvelle ligne chaque seconde
      .pipe(takeWhile(() => alive),
        map(i => {
          // Fin de boucle : recommencer le procédé
          if (i % this.Infos.positions.length === this.Infos.positions.length - 1) {
            alive = false;
            return this.fetchPos(req);
          }
          return this.Infos.positions[i % this.Infos.positions.length];
        })
      );

    positions.subscribe((value: any) => console.log(value))

    //latlng = new google.maps.LatLng(value.satlatitude, value.satlongitude);
    //marker.setPosition(latlng);

  });
}

declare global {
  interface Window {
    initMap: () => void;
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

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    positions = this.mapService.currentPosition;
    console.log(positions);
    positions.subscribe((value: any) => console.log(value));
    initMap();
  }
}
