import {Component, OnInit} from '@angular/core';
import {GoogleMapsService} from "../../services/GoogleMaps/google-maps.service";
import {StaticMap} from "../../utils/Interfaces/StaticMap";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import moment from "moment";
import {NotificationsService} from "../../services/Notifications";


interface Coord {
  origin: any,
  destination: any,
  distance: string,
  time: string,
}

@Component({
  selector: 'app-shipping-send',
  templateUrl: './shipping-send.page.html',
  styleUrls: ['./shipping-send.page.scss'],
})
export class ShippingSendPage implements OnInit {
  background: string = "";
  coord: Coord = null;

  form: FormGroup;

  constructor(
    public googleMapsService: GoogleMapsService,
    public notificationService: NotificationsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((params => {
      this.coord = params["coord"] ? JSON.parse(params["coord"]) : null;
    }))
  }

  ngOnInit() {
    this.init();
  }

  init() {
    if (this.coord) {
      const data: StaticMap = {
        latitude: this.coord.origin.latitude,
        longitude: this.coord.origin.longitude,
        height: 1200,
        width: 1200,
      }
      this.background = this.googleMapsService.setStaticMap(data)
      // this.settingForm();
    }
  }
/*
  settingForm() {
    this.form = new FormGroup({
      client: new FormControl('', Validators.required),
      origin: new FormControl(this.coord.origin.displayRoute, Validators.required),
      origin_gcs: new FormControl(`${this.coord.origin.latitude},${this.coord.origin.longitude}`, Validators.required),
      destination: new FormControl(this.coord.destination.displayRoute, Validators.required),
      destination_gcs: new FormControl(`${this.coord.destination.latitude},${this.coord.destination.longitude}`, Validators.required),
      name_destination: new FormControl('', Validators.required),
      phone_destination: new FormControl('', Validators.required),
      distance: new FormControl(this.coord.distance),
      time: new FormControl(this.coord.time),
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
  }*/

  continue() {
    console.log(this.form.value);
    this.notificationService.presentAlert(
      JSON.stringify(this.form.value),
      '',
      'Datos del formulario'
    )
  }

}
