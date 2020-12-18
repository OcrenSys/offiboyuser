import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectShippingPage } from './select-shipping.page';

const routes: Routes = [
  {
    path: '',
    component: SelectShippingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectShippingPageRoutingModule {}
