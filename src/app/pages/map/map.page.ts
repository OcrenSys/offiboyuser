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
  hideMap: boolean = true;
  isMapLoading: boolean = false;
  continue_label: string = "";
  option: any = MAP_STEP.ORIGIN

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
      this.isMapLoading = true;

      this.continue_label = "Lugar de origen";
      if (this.googleMapsService.directionsDisplay != null)
        this.resetMap()


      this.googleMapsService.initMapStatic(this.mapElement.nativeElement)
        .then((_map: any) => {
          // this.autocompleteService = new google.maps.places.AutocompleteService();
          // this.placesService = new google.maps.places.PlacesService(loaded_map);
          // this.searchDisabled = false;

          this.isMapLoading = false;
          this.hideMap = false;
          this.googleMapsService.map.panTo(_map.getCenter());
        })
    }
  }

  ionViewWillEnter() {
    if (this.initialized) {
      if (this.googleMapsService.markers.length) {
        const position = this.googleMapsService.markers[0].getPosition();
        console.log('posicion del marcador 1', position);
        this.googleMapsService.marker.setMap(this.googleMapsService.map);
        this.googleMapsService.marker.setPosition(position);
        this.googleMapsService.map.panTo(this.googleMapsService.markers[0].getPosition());

        this.marker_origin = new google.maps.Marker({
          position: this.googleMapsService.markers[0].getPosition(),
          map: this.googleMapsService.map,
          title: '',
          // icon: icon
        })
        this.marker_destination = new google.maps.Marker({
          position: this.googleMapsService.markers[1].getPosition(),
          map: this.googleMapsService.map,
          title: '',
          // icon: icon
        })

        // this.resetMap();
      }
    }
  }

  resetMap() {
    this.googleMapsService.markers = []
    this.googleMapsService.directionsDisplay.setMap(null)
    this.googleMapsService.directionsDisplay = new google.maps.DirectionsRenderer;
  }

  continue() {
    switch (this.option) {
      case MAP_STEP.ORIGIN:
        const origin_icon = {
          url: "./assets/icon/grn-circle.png", // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          //anchor: new google.maps.Point(0, 0) // anchor
        };

        this.marker_origin = new google.maps.Marker({
          position: new google.maps.LatLng(this.googleMapsService.latitude, this.googleMapsService.longitude),
          map: this.googleMapsService.map,
          title: 'Localizador',
          // icon: icon
        })
        this.continue_label = "Lugar de destino";
        this.option = MAP_STEP.DESTINATION;
        break;
      case MAP_STEP.DESTINATION:
        const destination_icon = {
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png', // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
          // origin: new google.maps.Point(0,0), // origin
          //anchor: new google.maps.Point(0, 0) // anchor
        };
        this.marker_destination = new google.maps.Marker({
          position: new google.maps.LatLng(this.googleMapsService.latitude, this.googleMapsService.longitude),
          map: this.googleMapsService.map,
          title: 'Localizador',
          // icon: destination_icon
        })
        this.continue_label = "Continuar";
        this.option = MAP_STEP.CONTINUE
        break;

      case MAP_STEP.CONTINUE:
        this.continue_label = "Lugar de origen";
        this.option = MAP_STEP.ORIGIN
        this.googleMapsService.markers.push(this.marker_origin);
        this.googleMapsService.markers.push(this.marker_destination);
        this.navCtrl.navigateForward(['./shipping-info'])
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

  centerMap(current_latitude: number, current_longitude: number) {
    this.googleMapsService.latLng = new google.maps.LatLng(current_latitude, current_longitude);
    this.googleMapsService.map.setZoom(17);
    this.googleMapsService.map.setCenter({lat: current_latitude, lng: current_longitude});
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
