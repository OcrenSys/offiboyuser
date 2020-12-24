import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";
import {AlertController, NavController, Platform} from "@ionic/angular";

declare var google;

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.page.html',
  styleUrls: ['./shipping-info.page.scss'],
})
export class ShippingInfoPage implements OnInit {
  @ViewChild('mapInfo', {static: true}) mapElement: ElementRef;

  truck_info: string = "about_trip";
  url_image_map: string = "";
  isMapLoading: boolean = false;
  hideMap = true;
  map: any = null;

  start_location = {
    latitude: null,
    longitude: null,
    displayRoute: ""
  }
  end_location = {
    latitude: null,
    longitude: null,
    displayRoute: ""
  }

  constructor(private platform: Platform,
              public googleMapsService: GoogleMapsService,
              private zone: NgZone,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.googleMapsService.initMapStatic(this.mapElement.nativeElement)
        .then((_map: any) => {
          this.map = _map;
          const origin = this.googleMapsService.markers[0].getPosition();
          const destination = this.googleMapsService.markers[1].getPosition();

          this.googleMapsService.markers[0].setMap(this.map)
          this.googleMapsService.markers[1].setMap(this.map)
          this.googleMapsService.marker.setMap(null);

          this.start_location = {
            latitude: origin.lat(),
            longitude: origin.lng(),
            displayRoute: ""
          }
          this.end_location = {
            latitude: destination.lat(),
            longitude: destination.lng(),
            displayRoute: ""
          }

          this.googleMapsService.settingDisplayRoute(origin, destination, this.map)
          this.googleMapsService.getNativeGeocoder(this.start_location)
          this.googleMapsService.getNativeGeocoder(this.end_location)
          this.googleMapsService.centerMap(origin.lat(), origin.lng(), this.map);

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

}
