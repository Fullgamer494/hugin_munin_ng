import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeregisterFormView } from './deregister-form.view';

describe('DeregisterFormView', () => {
  let component: DeregisterFormView;
  let fixture: ComponentFixture<DeregisterFormView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeregisterFormView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeregisterFormView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
