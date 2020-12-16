import {IService} from './IService';
import {AngularFireDatabase} from '@angular/fire/database';
import {Injectable} from '@angular/core';
import {AlertController, ToastController} from "@ionic/angular";

@Injectable({providedIn: 'root'})
export class NotificationsService implements IService {

  constructor(
    public af: AngularFireDatabase,
    private alertCtrl: AlertController,
    public toastController: ToastController
  ) {
  }

  async presentAlert(_message: string, _subheader?: string, _header?: string) {
    if (event) {
      event.stopPropagation();
    }
    const alert = await this.alertCtrl.create(
      {
        header: _header || "ArqueoApp",
        message: _message || "¡ArqueoApp, aviso!",
        subHeader: _subheader || "Aviso",
        cssClass: 'alert-warning',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              console.log('Ok clicked');
            }
          }
        ]
      });

    await alert.present();
  }

  async presentToast(message?: string, duration?: number) {
    const toast = await this.toastController.create({
      position: 'bottom',
      duration: duration || 3000,
      message: message || "Acción realizada"
    });
    await toast.present();
  }
}
