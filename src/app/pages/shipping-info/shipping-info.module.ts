import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingInfoPageRoutingModule } from './shipping-info-routing.module';

import { ShippingInfoPage } from './shipping-info.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ShippingInfoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ShippingInfoPage]
})
export class ShippingInfoPageModule {}
