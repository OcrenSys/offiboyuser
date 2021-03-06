import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SigninPage} from './signin.page';
import {SigninPageRoutingModule} from './signin-routing.module';

import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SigninPageRoutingModule,
    TranslateModule,
  ],
  declarations: [SigninPage]
})
export class SigninPageModule {
}
