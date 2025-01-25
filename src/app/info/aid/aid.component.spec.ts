import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidComponent } from './aid.component';

describe('AidComponent', () => {
  let component: AidComponent;
  let fixture: ComponentFixture<AidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AidComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
