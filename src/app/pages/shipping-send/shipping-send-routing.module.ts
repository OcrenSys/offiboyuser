import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingSendPage } from './shipping-send.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingSendPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingSendPageRoutingModule {}
