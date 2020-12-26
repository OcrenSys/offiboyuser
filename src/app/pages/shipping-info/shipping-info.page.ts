import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";
import {AlertController, NavController, Platform} from "@ionic/angular";
import {NavigationExtras, Router} from "@angular/router";

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

  constructor(
    private platform: Platform,
    private route: Router,
    public googleMapsService: GoogleMapsService,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      const origin = this.googleMapsService.markers[0].getPosition();
      const destination = this.googleMapsService.markers[1].getPosition();

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

      this.googleMapsService.initMapStatic(this.mapElement.nativeElement, this.start_location)
        .then((_map: any) => {
          this.map = _map;

          this.googleMapsService.markers[0].setMap(this.map);
          this.googleMapsService.markers[1].setMap(this.map);
          this.googleMapsService.marker.setMap(null);

          this.googleMapsService.settingDisplayRoute(origin, destination, this.map);
          this.googleMapsService.getNativeGeocoder(this.start_location);
          this.googleMapsService.getNativeGeocoder(this.end_location);
        })
        .finally(() => {
          setTimeout(() => {
            this.googleMapsService.centerMap(this.start_location.latitude, this.start_location.longitude, this.map)
            this.hideMap = false;
          }, 600)
        })
    }
  }

  continue() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        coord: JSON.stringify({
          origin: this.start_location,
          destination: this.end_location,
          distance: this.googleMapsService.displayRoute.distance,
          time: this.googleMapsService.displayRoute.time,
        }),
      }
    };
    this.route.navigate(['./shipping-send'], navigationExtras);
  }

}
