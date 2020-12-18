import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectShippingPageRoutingModule } from './select-shipping-routing.module';

import { SelectShippingPage } from './select-shipping.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SelectShippingPageRoutingModule
  ],
  declarations: [SelectShippingPage]
})
export class SelectShippingPageModule {}
