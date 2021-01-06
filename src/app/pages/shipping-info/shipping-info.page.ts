import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";
import {AlertController, NavController, Platform} from "@ionic/angular";
import {NavigationExtras, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import moment from "moment";

declare var google;

interface Coord {
  origin: any,
  destination: any,
  distance: string,
  time: string,
}

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.page.html',
  styleUrls: ['./shipping-info.page.scss'],
})
export class ShippingInfoPage implements OnInit {
  @ViewChild('mapInfo', {static: true}) mapElement: ElementRef;

  truck_info: string = "about_trip";
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

  form: FormGroup;
  coord: Coord = null;

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
    this.settingForm();
    // if (this.platform.is('cordova')) {
      this.settingMap();
    // }
  }

  settingMap () {
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
        this.googleMapsService.getGeocoder(this.start_location);
        this.googleMapsService.getGeocoder(this.end_location);
      })
      .finally(() => {
        setTimeout(() => {
          this.googleMapsService.centerMap(this.start_location.latitude, this.start_location.longitude, this.map)
          this.hideMap = false;
        }, 600)
      })
  }

  settingForm() {
    this.form = new FormGroup({
      client: new FormControl('', Validators.required),
      origin: new FormControl(this.start_location.displayRoute || "", Validators.required),
      origin_gcs: new FormControl(`${this.start_location.latitude},${this.start_location.longitude}`, Validators.required),
      destination: new FormControl(this.end_location.displayRoute, Validators.required),
      destination_gcs: new FormControl(`${this.end_location.latitude},${this.end_location.longitude}`, Validators.required),
      name_destination: new FormControl('', Validators.required),
      phone_destination: new FormControl('', Validators.required),
      distance: new FormControl(this.coord?.distance),
      time: new FormControl(this.coord?.time),
      type: new FormControl('Sobre', Validators.required),
      content: new FormControl('', Validators.required),
      date_initial: new FormControl(moment()),
      date_final: new FormControl(''),
      city_origin: new FormControl('', Validators.required),
      city_destination: new FormControl('', Validators.required),
      mode_id: new FormControl(1, Validators.required),
      crated_at: new FormControl(moment()),
      updated_at: new FormControl(moment()),
    })
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
