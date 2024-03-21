import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSatellitesComponent } from './select-satellites.component';

describe('SelectSatellitesComponent', () => {
  let component: SelectSatellitesComponent;
  let fixture: ComponentFixture<SelectSatellitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSatellitesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectSatellitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
