import {Injectable, NgZone} from '@angular/core';
import {Platform} from "@ionic/angular";
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Constants} from "../../utils/Constants";
import {DisplayRouteResult} from "../../utils/Interfaces/DisplayRouteResult";
import {StaticMap} from "../../utils/Interfaces/StaticMap";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {LocationAccuracy} from "@ionic-native/location-accuracy/ngx";
import {NotificationsService} from "../Notifications";

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
    public notification: NotificationsService,
    public androidPermissions: AndroidPermissions,
    public locationAccuracy: LocationAccuracy,
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
          .then((position: any) => {
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
        this.getGeocoder({
          latitude: this.marker.getPosition().lat(),
          longitude: this.marker.getPosition().lng()
        });
      }, 100);
    });

    /** testing marker center */
    this.map.addListener('center_changed', () => {
      this.marker.setPosition(this.map.getCenter());
    });
  }

  getCurrentPosition() {
    if (this.platform.is('cordova')) {
      return new Promise((resolve, reject): any => {
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(async result => {
              console.log("checkGPSPermission:", result);
              if (result.hasPermission) {
                this.requestGPSPermission(resolve, reject);
              } else {
                this.notification.presentToast(
                  `Para acceder a la ubicación del dispositivo debe conceder los permisos de Ubicación.`,
                  3000
                )
              }
            }, (error) => {
              console.log(error);
              this.notification.presentAlert(
                `Para acceder a la ubicación del dispositivo debe conceder los permisos de Ubicación. <br> Por favor verífquelos y vuelva a intentarlo`,
                'Permiso denegado',
                'Offiboy',
              )
              // reject(error)
            }
          );
      })
    } else {
      return this.getCurrentPositionNoPermission()
    }
  }

  requestGPSPermission(resolve, reject) {
    this.locationAccuracy.canRequest()
      .then((canRequest: boolean) => {
        if (canRequest) {
          //Show 'GPS Permission Request' dialogue
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then(async (response) => {
                console.log("this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)", response);
                // call method to turn on GPS
                let options = {
                  maximumAge: 10000,
                  timeout: 30000,
                  enableHighAccuracy: true
                };
                const current = await this.geolocation.getCurrentPosition(options);
                resolve(current)
              }, (error) => {
                console.log(error);
                //Show alert if user click on 'No Thanks'
                if (error.code == 4)
                  this.notification.presentAlert(
                    'Por favor, verifique que el servicio de ubicación de su teléfono esté encendido. Permita que Offiboy acceda a los servicios de ubicación de google para activar la ubicación de su dispositivo.',
                    '',
                    'Permiso denegado'
                  )
                reject(error)
              }
            );
        } else {
          console.log(canRequest);

          this.notification.presentAlert(
            'Verifique que tenga los servicios de ubicación estén encendidios, tenga los permisos para acceder a su ubicación',
            'Permiso denegado',
            'Offiboy',
          )
          reject(null)
        }
      });
  }

  getCurrentPositionNoPermission() {
    let options = {
      maximumAge: 10000,
      timeout: 30000,
      enableHighAccuracy: true
    };
    return this.geolocation.getCurrentPosition(options);

  }

  getGeocoder(prop?) {
    this.geocoder.geocode({
      'latLng': new google.maps.LatLng(prop?.latitude || this.latitude, prop?.longitude || this.longitude)
    }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          this.google_address = results[1]?.formatted_address || "";
          if (prop) prop.displayRoute = this.google_address;
          console.log("result", results);
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
