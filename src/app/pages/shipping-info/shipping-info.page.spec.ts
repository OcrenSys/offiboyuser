import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShippingInfoPage } from './shipping-info.page';

describe('ShippingInfoPage', () => {
  let component: ShippingInfoPage;
  let fixture: ComponentFixture<ShippingInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
