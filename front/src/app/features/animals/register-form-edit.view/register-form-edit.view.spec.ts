import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormEditView } from './register-form-edit.view';

describe('RegisterFormEditView', () => {
  let component: RegisterFormEditView;
  let fixture: ComponentFixture<RegisterFormEditView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormEditView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormEditView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
