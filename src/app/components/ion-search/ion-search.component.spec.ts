import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IonSearchComponent } from './ion-search.component';

describe('IonSearchComponent', () => {
  let component: IonSearchComponent;
  let fixture: ComponentFixture<IonSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonSearchComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IonSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
