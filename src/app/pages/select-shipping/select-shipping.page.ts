import {Component, OnInit} from '@angular/core';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-select-shipping',
  templateUrl: './select-shipping.page.html',
  styleUrls: ['./select-shipping.page.scss'],
})
export class SelectShippingPage implements OnInit {

  TYPE_LOCAL: 1;
  TYPE_PROVINCE: 2;

  constructor(
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
  }

  selectType(type: number) {
    switch (type) {
      case this.TYPE_LOCAL:
        this.navCtrl.navigateForward(['./map']);
        break;
      case this.TYPE_PROVINCE:
        this.navCtrl.navigateForward(['./map']);
        break;
    }
  }

}
