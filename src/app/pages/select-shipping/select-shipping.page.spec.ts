import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectShippingPage } from './select-shipping.page';

describe('SelectShippingPage', () => {
  let component: SelectShippingPage;
  let fixture: ComponentFixture<SelectShippingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectShippingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectShippingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
