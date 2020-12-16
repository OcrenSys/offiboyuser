import { NavController } from '@ionic/angular';

export interface IService {
  presentAlert(_message: string, _subheader?: string, _header?: string): any;
  presentToast(message?: string, duration?: number): any;
}
