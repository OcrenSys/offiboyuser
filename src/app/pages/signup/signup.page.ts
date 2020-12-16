import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NavController, ToastController} from "@ionic/angular";
import {AuthenticationService} from "../../services/Authentication/authentication.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  form = {
    name: "",
    email: "",
    password: "",
    country: "ECUADOR",
    app_id: 1,
  }

  constructor(
    private route: Router,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    ) {
  }

  ngOnInit() {
  }

  signIn() {
    this.navCtrl.navigateRoot(['./signin']);
  }

  home() {
    this.navCtrl.navigateRoot(['./home']);
  }

  onRegister(): void {
    this.presentToast('onRegister:' + JSON.stringify(this.form));
    this.authService.registerUser(this.form)
      .then(res => {
        console.log(res);
        this.navCtrl.navigateForward("login", {});
      }, err => {
        console.log(err);
      })
  }

  async presentToast(message?: string, duration?: number) {
    const toast = await this.toastCtrl.create({
      position: 'bottom',
      duration: duration || 3000,
      message: message || "Acción realizada"
    });
    await toast.present();
  }
}
