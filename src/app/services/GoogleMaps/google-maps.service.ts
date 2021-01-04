import {Injectable, NgZone} from '@angular/core';
import {Platform} from "@ionic/angular";
import {NativeGeocoder} from "@ionic-native/native-geocoder/ngx";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Constants} from "../../utils/Constants";
import {DisplayRouteResult} from "../../utils/Interfaces/DisplayRouteResult";
import {StaticMap} from "../../utils/Interfaces/StaticMap";

declare var google;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  mapElement: any;

  zoomMap: number = 16;
  latLng: any = null;
  latitude: any;
  longitude: any;
  accuracy: any = 0;
  google_address: any = "";

  displayRoute: DisplayRouteResult = {
    directionsDisplay: "",
    time: 0,
    distance: 0,
    exist: false
  }

  mapInitialised: boolean = false;
  directionsService: any = null;
  directionsDisplay: any = null;
  geocoder: any = null;

  map: any = null;
  marker: any = null;
  markers: any = []

  constructor(
    public geolocation: Geolocation,
    public zone: NgZone,
    public platform: Platform,
    // public util: Utilidades,
    // public direccionesProvider: DireccionesProvider,
    public nativeGeocoder: NativeGeocoder,
  ) {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.geocoder = new google.maps.Geocoder;
  }

  initMapStatic(mapElement: any, defaultOrigin?: any): Promise<any> {
    this.latitude = 0;
    this.longitude = 0;
    this.accuracy = 0;
    return new Promise((resolve) => {
      this.mapElement = mapElement;
      this.mapInitialised = true;

      if (defaultOrigin) {
        this.loadStaticMap({
          accuracy: 0,
          latitude: defaultOrigin.latitude,
          longitude: defaultOrigin.longitude,
        });
        resolve(this.map)
      } else {
        this.getCurrentPosition()
          .then((position) => {
            this.loadStaticMap({
              accuracy: position.coords.accuracy,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          })
          .then(() => {
            resolve(this.map)
          })
      }
    })
  }

  loadStaticMap(data: any) {
    // console.log("loadStaticMap(data)...\n", data);
    this.accuracy = data.accuracy;
    this.latitude = data.latitude;
    this.longitude = data.longitude;

    this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
    this.getGeocoder();

    let mapOptions = {
      center: this.latLng,
      zoom: this.zoomMap,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      controls: {
        myLocationButton: true
      }
    };

    this.map = new google.maps.Map(this.mapElement, mapOptions);
    let infowindow = new google.maps.InfoWindow();

    const icon = {
      url: "./assets/imgs/pin3.png", // url
      scaledSize: new google.maps.Size(30, 40), // scaled size
      // origin: new google.maps.Point(0,0), // origin
      //anchor: new google.maps.Point(0, 0) // anchor
    };

    this.marker = new google.maps.Marker({
      position: this.latLng,
      // animation: google.maps.Animation.DROP,
      map: this.map,
      title: 'Localizador',
      icon: icon
    })

    google.maps.event.addListenerOnce(this.map, 'idle', () => {

    });

    google.maps.event.addListener(this.map, 'dragend', (evt) => {
      setTimeout(() => {
        let center = this.map.getCenter();
        this.latitude = center.lat();
        this.longitude = center.lng();
        this.map.panTo(this.map.getCenter());
        this.getGeocoder();
      }, 100);
    });

    /** testing marker center */
    this.map.addListener('center_changed', () => {
      this.marker.setPosition(this.map.getCenter());
    });
  }

  getCurrentPosition() {
    let options = {
      maximumAge: 10000,
      timeout: 30000,
      enableHighAccuracy: true
    };
    return this.geolocation.getCurrentPosition(options);

    /*this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      console.log(this.latitude+","+this.longitude);
      this.loadMap(resp.coords.latitude,resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });*/
  }

  getGeocoder(prop?) {
    this.geocoder.geocode({
      'latLng': new google.maps.LatLng(prop?.latitude || this.latitude, prop?.longitude || this.longitude)
    }, function (results, status) {
      const self = this;
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          self.google_address = results[1].formatted_address;
          if (prop) prop.displayRoute = self.google_address;
          console.log("result", results[1]);
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  settingDisplayRoute(origin, destination, map?: any) {
    this.directionsDisplay.setMap(map);
    this.directionsDisplay.setOptions({suppressMarkers: true});

    this.directionsService.route({
      origin: origin,
      destination: destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        // console.log("route:", response);
        // t.markers[0].setMap(null);
        // t.markers[1].setMap(null);
        this.directionsDisplay.setDirections(response);
        this.displayRoute.distance = response.routes[0].legs[0].distance.text;
        this.displayRoute.time = response.routes[0].legs[0].duration.text;
        this.displayRoute.exist = true;
        this.displayRoute.directionsDisplay = "";
        // console.log("displayRoute...\n", this.displayRoute);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }

  centerMap(_lat: string, _lng: string, _map: any) {
    this.latLng = new google.maps.LatLng(_lat, _lng);
    _map.setZoom(this.zoomMap);
    _map.setCenter(this.latLng);
    _map.panTo(this.latLng);
  }

  setStaticMap(data: StaticMap): string {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude}+${data.longitude}&zoom=${data.zoom || this.zoomMap}&scale=2&size=${data.width || 600}x${data.height || 300}&maptype=roadmap&key=${Constants.API_KEY}&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:A%7C${data.latitude}+${data.longitude}`;
  }

}
