import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingSendPageRoutingModule } from './shipping-send-routing.module';

import { ShippingSendPage } from './shipping-send.page';
import {TranslateModule} from "@ngx-translate/core";
import {AppModule} from "../../app.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    TranslateModule,
    ShippingSendPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ShippingSendPage]
})
export class ShippingSendPageModule {}
