import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<< Updated upstream
import { FreelanceServicesComponent } from './freelance-service.component';
=======
import { FreelanceServicesComponent} from './freelance-service.component';
>>>>>>> Stashed changes

describe('ServicesComponent', () => {
  let component: FreelanceServicesComponent;
  let fixture: ComponentFixture<FreelanceServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreelanceServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreelanceServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
