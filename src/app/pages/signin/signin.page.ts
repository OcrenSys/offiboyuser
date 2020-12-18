import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertController, MenuController, NavController, ToastController} from "@ionic/angular";
import {AuthenticationService} from "../../services/Authentication/authentication.service";
import {NotificationsService} from "../../services/Notifications";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit, OnDestroy {

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
    private notification: NotificationsService,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
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
        this.notification.presentAlert(
          response || 'token',
          'Access token',
          'Success Login'
        ).then(r => console.log("finalized toast..."));
        this.navCtrl.navigateRoot(['./home']);
      }, err => {
        console.log(err);
        this.notification.presentToast(
          'Upps... lo sentimos, ocurrió un error inesperado.'
        ).then(r => console.log("finalized toast..."));
      })
  }
}
