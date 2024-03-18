import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

let map: google.maps.Map, infoWindow: google.maps.InfoWindow;

const loader = new Loader({
  apiKey: "AIzaSyD4FY5MdRbUhjsHQDETMaQ_gX3T0tADyCE",
  version: "weekly",
  libraries: ["places"]
});

// Paramètres de la carte
let mapOptions = {
  center: {
    lat: -25.363,
    lng: 131.044
  },
  zoom: 4
};

function initMap() {

  loader.load().then((google) => {
    map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      mapOptions
    );
  });
  new google.maps.Marker({
    position: {
      lat: -25.363,
      lng: 131.044
    },
    map,
    title: "Hello World!",
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
  imports: [],
  templateUrl: './googlemaps.component.html',
  styleUrl: './googlemaps.component.scss'
})

export class GooglemapsComponent implements OnInit {
  ngOnInit(): void {
    initMap();
  }
}
