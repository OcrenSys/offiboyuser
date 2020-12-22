import {Injectable, NgZone} from '@angular/core';
import {Platform} from "@ionic/angular";
import {NativeGeocoder, NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoderResult} from "@ionic-native/native-geocoder";
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
  }

  initMapStatic(mapElement: any): Promise<any> {
    this.latitude = 0;
    this.longitude = 0;
    this.accuracy = 0;
    return new Promise((resolve) => {
      this.mapElement = mapElement;
      this.mapInitialised = true;

      this.getCurrentPosition()
        .then((position) => {
          let data = {
            accuracy: position.coords.accuracy,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.loadStaticMap(data);
        })
        .then(() => {
          resolve(this.map)
        })
    })
  }

  loadStaticMap(data: any) {
    // console.log("loadStaticMap(data)...\n", data);
    this.accuracy = data.accuracy;
    this.latitude = data.latitude;
    this.longitude = data.longitude;

    this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
    this.getNativeGeocoder();

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
      scaledSize: new google.maps.Size(30, 30), // scaled size
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

        // this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
        // this.marker.setPosition(this.map.getCenter());
        this.map.panTo(this.map.getCenter());
        this.getNativeGeocoder();
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

  getNativeGeocoder(prop?) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(prop?.latitude || this.latitude, prop?.longitude || this.longitude, options)
      .then(
        (result: NativeGeocoderResult[]) => {
          let countryName = result[0].countryName ? result[0].countryName.concat(", ") : "";
          let administrativeArea = result[0].administrativeArea ? "" + result[0].administrativeArea.concat(", ") : "";
          let subAdministrativeArea = result[0].subAdministrativeArea ? "" + result[0].subAdministrativeArea.concat(", ") : "";
          let locality = result[0].locality ? result[0].locality.concat(", ") : "";
          let subLocality = result[0].subLocality ? result[0].subLocality.concat(", ") : "";
          let thoroughfare = result[0].thoroughfare ? result[0].thoroughfare.concat(", ") : "";
          let subThoroughfare = result[0].subThoroughfare ? result[0].subThoroughfare.concat(", ") : "";

          this.google_address = subAdministrativeArea + subLocality + administrativeArea + thoroughfare + subThoroughfare + locality + countryName;
          if(prop) prop.displayRoute = subAdministrativeArea + subLocality + administrativeArea + thoroughfare + subThoroughfare + locality + countryName;
          // this.displayRoute.directionsDisplay = subAdministrativeArea + subLocality + administrativeArea + thoroughfare + subThoroughfare + locality + countryName;
          // console.log('\n\nNative geocoder:\n', this.google_address);
        })
      .catch((error: any) => {
        console.log('error getNativeGeocoder...', error)
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


  setStaticMap(data: StaticMap): string {
    console.log('\n\nSetting StaticMap...\n', data);
    let url = `https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude}+${data.longitude}&zoom=${data.zoom}&scale=1&size=600x300&maptype=roadmap&key=${Constants.API_KEY}&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:A%7C${data.latitude}+${data.longitude}`;
    if (data.origin != null && data.destination != null) {
      // `path=color:0x0000ff|weight:5|${data.origin.latitude},${data.origin.longitude}|${data.destination.latitude},${data.destination.longitude}`;
        url = `https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude}+${data.longitude}&zoom=${data.zoom}&scale=1&size=600x300&maptype=roadmap&key=${Constants.API_KEY}&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:A%7C${data.latitude}+${data.longitude}&path=color:0x0000ff|weight:5|${data.origin.latitude},${data.origin.longitude}|${data.destination.latitude},${data.destination.longitude}`;
    }

    console.log('\n\nfinal url...\n', url);
    return url
  }

}
