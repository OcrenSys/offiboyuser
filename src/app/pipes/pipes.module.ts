import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {CountrycodePipe} from "./countrycode/countrycode.pipe";

@NgModule({
  declarations: [
    CountrycodePipe,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [
    CountrycodePipe,
  ]
})
export class PipesModule {
}
