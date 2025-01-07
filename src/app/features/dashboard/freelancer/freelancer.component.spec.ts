import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerComponent } from './freelancer.component';

describe('FreelancerComponent', () => {
  let component: FreelancerComponent;
  let fixture: ComponentFixture<FreelancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelancerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
