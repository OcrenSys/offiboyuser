import {AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertController, Platform} from "@ionic/angular";
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  @ViewChild('map', {static: true}) mapElement: ElementRef;

  hideMap = true;
  isMapLoading: boolean = false;

  constructor(
    private platform: Platform,
    public googleMapsService: GoogleMapsService,
    private zone: NgZone,
    private alertCtrl: AlertController,
  ) {
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.isMapLoading = true;
      this.googleMapsService.initMapStatic(this.mapElement.nativeElement).then((loaded_map: any) => {
        // this.autocompleteService = new google.maps.places.AutocompleteService();
        // this.placesService = new google.maps.places.PlacesService(loaded_map);
        // this.searchDisabled = false;
        this.isMapLoading = false;
        this.hideMap = false;
      })
    }
  }

  addMarker() {
    const icon = {
      url: "./assets/icon/grn-circle.png", // url
      scaledSize: new google.maps.Size(30, 30), // scaled size
      // origin: new google.maps.Point(0,0), // origin
      //anchor: new google.maps.Point(0, 0) // anchor
    };

    this.googleMapsService.markers.push(
      new google.maps.Marker({
        position: new google.maps.LatLng(this.googleMapsService.latitude, this.googleMapsService.longitude),
        map: this.googleMapsService.map,
        title: 'Localizador',
        // icon: icon
      })
    )

    if(this.googleMapsService.markers.length === 2) {
      const origin = this.googleMapsService.markers[0].getPosition();
      const destination = this.googleMapsService.markers[1].getPosition();
      this.googleMapsService.settingDisplayRoute(origin, destination)
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
