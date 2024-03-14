import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoTestComponent } from './compo-test.component';

describe('CompoTestComponent', () => {
  let component: CompoTestComponent;
  let fixture: ComponentFixture<CompoTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompoTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompoTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
