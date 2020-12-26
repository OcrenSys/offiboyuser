import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShippingSendPage } from './shipping-send.page';

describe('ShippingSendPage', () => {
  let component: ShippingSendPage;
  let fixture: ComponentFixture<ShippingSendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingSendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingSendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
