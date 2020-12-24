import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, Platform} from "@ionic/angular";
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";
import {MAP_STEP} from "../../utils/Enums/Markers";
import {IonSearchComponent} from "../../components/ion-search/ion-search.component";
import {Places} from "../../utils/Enums/Places";

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
  color: string = "";
  continue_label: string = "";
  option: any = MAP_STEP.ORIGIN

  map: any = null;
  places: Array<any> = [];
  location: any = null;
  autocompleteService: any = null;
  placesService: any = null;

  constructor(
    private zone: NgZone,
    private platform: Platform,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    public googleMapsService: GoogleMapsService,
  ) {
  }

  ngOnInit() {
    this.initialized = true;
    if (this.platform.is('cordova')) {
      this.color = "primary";
      this.continue_label = "Seleccionar origen";
      if (this.googleMapsService.directionsDisplay != null)
        this.resetMap()

      const QUITO = {
        latitude: "-0.17945745700059929",
        longitude: "-78.47123815826913",
      }
      this.googleMapsService.initMapStatic(this.mapElement.nativeElement, QUITO)
        .then((_map: any) => {
          this.autocompleteService = new google.maps.places.AutocompleteService();
          this.placesService = new google.maps.places.PlacesService(_map);
          // this.searchDisabled = false;
          this.map = _map;
        })
        .finally(() => {
          setTimeout(() => {
            // this.map.panTo(this.map.getCenter())
            // google.maps.event.trigger(this.map, 'resize');
            this.hideMap = false;
          }, 1000)

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

        this.googleMapsService.centerMap(this.marker_origin.getPosition().lat(), this.marker_origin.getPosition().lng(), this.map)

        this.marker_origin.setMap(null);
        this.marker_destination.setMap(null);
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

  async ionFocus() {
    const modal = await this.modalCtrl.create({
      component: IonSearchComponent,
      componentProps: {
        autocompleteService: this.autocompleteService,
        placesService: this.placesService,
        input: this.googleMapsService.google_address
      },
      cssClass: 'my-custom-class'
    });
    await modal.present();
    await modal.onDidDismiss().then((response: any) => {
      const data = response?.data?.data || null;
      const type = response?.data?.type;

      if (type === Places.CURRENT_LOCATION)
        this.getCurrentPosition();

      if (type === Places.SELECTED_LOCATION)
        if (data)
          this.selectPlace(data);
    })
  }

  selectPlace(place) {
    this.places = [];
    let location = {
      lat: null,
      lng: null,
      description: place.description || '',
      name: place.name || ''
    };

    this.placesService.getDetails(
      {placeId: place.place_id},
      (place_details) => {
        this.zone.run(() => {
          location.name = place_details.name;
          location.description = place_details.formatted_address;
          location.lat = place_details.geometry.location.lat();
          location.lng = place_details.geometry.location.lng();
          // this.location = location;
          // this.saveDisabled = false;

          this.googleMapsService.latitude = place_details.geometry.location.lat();
          this.googleMapsService.longitude = place_details.geometry.location.lng();

          this.googleMapsService.centerMap(location.lat, location.lng, this.map);
        });
      });
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
            icon: {
              path: 'm 12,2.4000002 c -2.7802903,0 -5.9650002,1.5099999 -5.9650002,5.8299998 0,1.74375 1.1549213,3.264465 2.3551945,4.025812 1.2002732,0.761348 2.4458987,0.763328 2.6273057,2.474813 L 12,24 12.9825,14.68 c 0.179732,-1.704939 1.425357,-1.665423 2.626049,-2.424188 C 16.809241,11.497047 17.965,9.94 17.965,8.23 17.965,3.9100001 14.78029,2.4000002 12,2.4000002 Z',
              fillColor: '#FF0000',
              fillOpacity: 1.0,
              strokeColor: '#000000',
              strokeWeight: 1,
              scale: 2,
              anchor: new google.maps.Point(12, 24),
            }
          })
        } else {
          this.marker_origin.setMap(this.map);
          this.marker_origin.setPosition(this.googleMapsService.marker.getPosition());
        }
        this.color = "secondary";
        this.continue_label = "Seleccionar destino";
        this.option = MAP_STEP.DESTINATION;
        break;

      case MAP_STEP.DESTINATION:
        if (!this.edition_mode) {
          this.marker_destination = new google.maps.Marker({
            position: new google.maps.LatLng(this.googleMapsService.latitude, this.googleMapsService.longitude),
            map: this.map,
            icon: {
              path: 'm 12,2.4000002 c -2.7802903,0 -5.9650002,1.5099999 -5.9650002,5.8299998 0,1.74375 1.1549213,3.264465 2.3551945,4.025812 1.2002732,0.761348 2.4458987,0.763328 2.6273057,2.474813 L 12,24 12.9825,14.68 c 0.179732,-1.704939 1.425357,-1.665423 2.626049,-2.424188 C 16.809241,11.497047 17.965,9.94 17.965,8.23 17.965,3.9100001 14.78029,2.4000002 12,2.4000002 Z',
              fillColor: '#00FF00',
              fillOpacity: 1.0,
              strokeColor: '#000000',
              strokeWeight: 1,
              scale: 2,
              anchor: new google.maps.Point(12, 24),
            }
          })
        } else {
          this.marker_destination.setMap(this.map);
          this.marker_destination.setPosition(this.googleMapsService.marker.getPosition());
        }
        this.color = "secondary";
        this.continue_label = "Continuar";
        this.googleMapsService.marker.setMap(null);
        this.option = MAP_STEP.CONTINUE;
        break;

      case MAP_STEP.CONTINUE:
        this.color = "primary";
        this.continue_label = "Seleccionar origen";
        this.option = MAP_STEP.ORIGIN;
        this.googleMapsService.marker.setMap(null);
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
      this.googleMapsService.centerMap(this.googleMapsService.latitude, this.googleMapsService.longitude, this.map);
    }).catch((error: any) => {
      console.log('error loading_directions mapa', error);
      this.presentAlert()
    });
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
