import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertController, NavController, Platform} from "@ionic/angular";
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";
import {MAP_STEP} from "../../utils/Enums/Markers";

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  @ViewChild('map', {static: true}) mapElement: ElementRef;

  marker_origin: any = null
  marker_destination: any = null

  initialized: boolean = false;
  edition_mode: boolean = false;
  hideMap: boolean = true;
  isMapLoading: boolean = false;
  continue_label: string = "";
  option: any = MAP_STEP.ORIGIN

  map: any = null;
  // position_origin: any = null;
  // position_destination: any = null;

  constructor(
    private platform: Platform,
    public googleMapsService: GoogleMapsService,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.initialized = true;
    if (this.platform.is('cordova')) {
      this.continue_label = "Lugar de origen";
      if (this.googleMapsService.directionsDisplay != null)
        this.resetMap()

      this.googleMapsService.initMapStatic(this.mapElement.nativeElement)
        .then((_map: any) => {
          // this.autocompleteService = new google.maps.places.AutocompleteService();
          // this.placesService = new google.maps.places.PlacesService(loaded_map);
          // this.searchDisabled = false;
          this.map = _map;
          this.hideMap = false;
        })
        .finally(() => {
          this.map.panTo(this.map.getCenter());
        })
    }
  }

  ionViewWillEnter() {
    if (this.initialized) {
      if (this.googleMapsService.markers.length) {
        this.edition_mode = true;
        this.hideMap = false;
        this.marker_origin = this.googleMapsService.markers[0];
        this.marker_destination = this.googleMapsService.markers[1];

        this.googleMapsService.markers[0].setMap(null);
        this.googleMapsService.markers[1].setMap(null);

        this.centerMap(this.marker_origin.getPosition().lat(), this.marker_origin.getPosition().lng())

        this.marker_origin.setMap(null)
        this.marker_destination.setMap(null)
        this.googleMapsService.markers = [];

        this.map.panTo(this.map.getCenter());
        this.googleMapsService.marker.setMap(this.map);
        this.googleMapsService.marker.setPosition(this.map.getCenter());

        this.map.addListener('center_changed', () => {
          this.googleMapsService.marker.setPosition(this.map.getCenter());
        });
      }
    }
  }

  ionFocus() {

  }

  resetMap() {
    this.googleMapsService.markers = []
    this.googleMapsService.directionsDisplay.setMap(null)
    this.googleMapsService.directionsDisplay = new google.maps.DirectionsRenderer;
  }

  continue() {
    switch (this.option) {
      case MAP_STEP.ORIGIN:
        if (!this.edition_mode) {
          this.marker_origin = new google.maps.Marker({
            position: new google.maps.LatLng(this.googleMapsService.latitude, this.googleMapsService.longitude),
            map: this.map,
            /*icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            }*/
          })
        } else {
          this.marker_origin.setMap(this.map);
          this.marker_origin.setPosition(this.googleMapsService.marker.getPosition());
        }
        this.continue_label = "Lugar de destino";
        this.option = MAP_STEP.DESTINATION;
        break;

      case MAP_STEP.DESTINATION:
        if (!this.edition_mode) {
          this.marker_destination = new google.maps.Marker({
            position: new google.maps.LatLng(this.googleMapsService.latitude, this.googleMapsService.longitude),
            map: this.map,
            /*icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 0),
            }*/
          })
        } else {
          this.marker_destination.setMap(this.map);
          this.marker_destination.setPosition(this.googleMapsService.marker.getPosition());
        }
        this.continue_label = "Continuar";
        this.option = MAP_STEP.CONTINUE;
        break;

      case MAP_STEP.CONTINUE:
        this.continue_label = "Lugar de origen";
        this.option = MAP_STEP.ORIGIN;
        this.googleMapsService.markers.push(this.marker_origin);
        this.googleMapsService.markers.push(this.marker_destination);
        this.navCtrl.navigateForward(['./shipping-info']);
        break;
    }
  }

  getCurrentPosition() {
    this.googleMapsService.getCurrentPosition().then((position) => {
      this.zone.run(() => {
        this.googleMapsService.accuracy = position.coords.accuracy;
        this.googleMapsService.latitude = position.coords.latitude;
        this.googleMapsService.longitude = position.coords.longitude;
      });
    }).then(() => {
      this.googleMapsService.getNativeGeocoder();
      this.centerMap(this.googleMapsService.latitude, this.googleMapsService.longitude);
    }).catch((error: any) => {
      console.log('error loading_directions mapa', error);
      this.presentAlert()
    });
  }

  centerMap(current_latitude: string, current_longitude: string) {
    this.googleMapsService.latLng = new google.maps.LatLng(current_latitude, current_longitude);
    this.map.setZoom(17);
    this.map.setCenter({lat: current_latitude, lng: current_longitude});
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Offiboy',
      subHeader: 'Algo salió mal',
      message: 'No se pudo obtener tu ubicación',
      cssClass: 'alertCustomButtons',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          cssClass: 'btn_cancel_clear',
          handler: () => {
            // this.close();
          }
        },
        {
          text: 'Reintentar',
          cssClass: 'btn_ok',
          handler: () => {
            // this.init();
          }
        }
      ]
    })

    await alert.present();
  }
}
