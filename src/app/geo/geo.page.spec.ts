import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GeoPage } from './geo.page';

describe('GeoPage', () => {
  let component: GeoPage;
  let fixture: ComponentFixture<GeoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GeoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
