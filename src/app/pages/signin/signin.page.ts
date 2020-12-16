import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, MenuController, NavController, ToastController} from "@ionic/angular";
import {AuthenticationService} from "../../services/Authentication/authentication.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  form = {
    email: "",
    password: "",
    app_id: 1,
  }

  constructor(
    private route: Router,
    private navCtrl: NavController,
    public menuCtrl: MenuController,
    private toastCtrl: ToastController,
    private alertService: AlertController,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
  }

  signUp() {
    this.navCtrl.navigateRoot(['./signup']);
  }

  verification() {
    this.route.navigate(['./verification']);
  }

  onLogin(): void {
    this.authService.loginUser(this.form)
      .then((response: any) => {
        console.log('\n\nlogin server, response:\n', response);
        this.navCtrl.navigateForward('/');
      }, err => {
        console.log(err);
        this.presentToast('Upps... lo sentimos, ocurrió un error inesperado.').then(r => console.log("finalized toast..."));
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
