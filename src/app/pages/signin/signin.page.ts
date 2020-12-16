import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  constructor(private route: Router, private navCtrl: NavController) {
  }

  ngOnInit() {
  }

  signUp() {
    this.navCtrl.navigateRoot(['./sign-up']);
  }

  verification() {
    this.route.navigate(['./verification']);
  }

}
