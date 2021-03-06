import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {HttpClient} from "@angular/common/http";
import {DBContextService} from "../DBContext/dbcontext.service";
import * as firebase from 'firebase';
import {NotificationsService} from "../Notifications";
import {AlertController} from "@ionic/angular";
import {Constants} from "../../utils/Constants";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any = null;
  AUTH_TOKEN_JWT: any = null;
  message_verification: string = "Para continuar, revise en la bandeja de entrada de su correo electrónico, un email que recibió con un enlace de verificación, haga click en este enlace y confirme su cuenta de correo electrónico y listo, ya podrá iniciar sesión con su cuenta en OffiBoy app.";


  constructor(
    private afAuth: AngularFireAuth,
    private db: DBContextService,
    private alertCtrl: AlertController,
    private notification: NotificationsService,
    private https: HttpClient
    // private util: Util,
  ) {
  }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          (res) => {
            this.sendEmailVerification().then(() => {
              this.verifyEmailAlert(this.message_verification, 'Registro exitoso', 'Verificación de correo')
                .then(() => {
                  this.notification.presentToast(
                    'Se ha enviado un email a su dirección de correo electrónico.',
                    10000
                  )
                });
            });
            resolve(res)
          },
          (err) => {
            this.notification.presentAlert(
              'Ocurrió un error inesperado al registrar su usuario, verifique su información e intentelo nuevamente.',
              'Registro fallido',
              'Offiboy'
            )
            reject(err)
          })
    })
  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email.trim(), value.password.trim())
        .then(
          (res: any) => {
            console.log(res);
            if (res.user.emailVerified) {
              this.db.setData("MODEL_TOKEN_FIREBASE", res.user.ya);
              resolve(res.user.ya);
              // this.loginServer(res.user.xa, resolve, reject);
            } else {
              console.log('email no verify, value: ', value);
              this.verifyEmailAlert(
                this.message_verification,
                'Inicio de sesión fallido',
                'Offiboy'
              )
            }
          },
          (reason: any) => {
            if (reason.code == "auth/invalid-email")
              this.notification.presentAlert('La cuenta o contraseña digitada es incorrecta, si no recuerda su contraseña, puede restablezerla ahora.', 'Autenticación', 'Error');
            else if (reason.code == 'auth/wrong-password')
              this.notification.presentAlert('La cuenta o contraseña digitada es incorrecta, si no recuerda su contraseña, puede restablezerla ahora.', 'Autenticación', 'Error');
            else if (reason.code == 'auth/user-not-found')
              this.notification.presentAlert('El usuario aún no se encuentra registrado en el sistema.', 'Autenticación', 'Error');
            else
              this.notification.presentAlert(reason.message, 'Autenticación', 'Error');
            reject(reason);
          });
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut().then(() => {
          console.log("LOG Out");
          this.db.setData(Constants.STORAGE_TOKEN, null);
          this.db.setData(Constants.STORAGE_TOKEN_FIREBASE, null);
          this.db.setData(Constants.STORAGE_AUTH_TOKEN_JWT, null);

          this.db.setData(Constants.STORAGE_USER_DATA, null);
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }


  async verifyEmailAlert(_message: string, _subheader?: string, _header?: string) {
    if (event) {
      event.stopPropagation();
    }
    const alert = await this.alertCtrl.create(
      {
        header: _header || "OffiBoy app",
        message: _message || "¡OffiBoy app, aviso!",
        subHeader: _subheader || "Aviso",
        cssClass: 'alert-warning',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              console.log('Ok clicked');
            }
          }, {
            text: 'Reenviar',
            handler: () => {
              this.sendEmailVerification();
            }
          }
        ]
      });

    await alert.present();
  }

  sendEmailVerification() {
    const auth = firebase.auth();
    return auth.currentUser.sendEmailVerification();
  }

  resetPassword(email: string) {
    const auth = firebase.auth();
    return auth.sendPasswordResetEmail(email);
  }
}
