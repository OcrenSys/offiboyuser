import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonSearchComponent} from "./ion-search/ion-search.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    IonSearchComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    // BrowserModule,
  ],
  exports: [
    IonSearchComponent,
  ]
})
export class ComponentsModule {
}
