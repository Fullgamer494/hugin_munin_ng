import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormView } from './register-form.view';

describe('RegisterFormView', () => {
  let component: RegisterFormView;
  let fixture: ComponentFixture<RegisterFormView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
