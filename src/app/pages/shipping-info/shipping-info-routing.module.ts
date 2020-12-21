import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingInfoPage } from './shipping-info.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingInfoPageRoutingModule {}
