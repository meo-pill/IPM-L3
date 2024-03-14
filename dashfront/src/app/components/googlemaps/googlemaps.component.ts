import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

let map: google.maps.Map, infoWindow: google.maps.InfoWindow;

const loader = new Loader({
  apiKey: "AIzaSyD4FY5MdRbUhjsHQDETMaQ_gX3T0tADyCE",
  version: "weekly",
  libraries: ["places"]
});

// Paramètres de la carte (coordonées latitudes et longitudes et le zoom)
let mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 0
};

function initMap() {
  loader.load().then((google) => {
    map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
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
