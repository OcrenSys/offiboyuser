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
  @ViewChild('map', {static: true}) mapElement: ElementRef;

  truck_info: string = "about_trip";
  url_image_map: string = "";
  isMapLoading: boolean = false;
  hideMap = true;

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
      this.isMapLoading = true;
      this.googleMapsService.initMapStatic(this.mapElement.nativeElement)
        .then((_map: any) => {
          this.isMapLoading = false;
          this.hideMap = false;
          this.googleMapsService.map.panTo(_map.getCenter());

          this.googleMapsService.marker.setMap(null);

          const origin = this.googleMapsService.markers[0].getPosition();
          const destination = this.googleMapsService.markers[1].getPosition();
          this.googleMapsService.settingDisplayRoute(origin, destination)

          this.googleMapsService.markers[0].setMap(this.googleMapsService.map)
          this.googleMapsService.markers[1].setMap(this.googleMapsService.map)

          this.start_location = {
            latitude: origin.lat(),
            longitude: origin.lng(),
            displayRoute: ""
          }
          this.googleMapsService.getNativeGeocoder(this.start_location)

          this.end_location = {
            latitude: destination.lat(),
            longitude: destination.lng(),
            displayRoute: ""
          }
          this.googleMapsService.getNativeGeocoder(this.end_location)
        })
    }
  }

}
