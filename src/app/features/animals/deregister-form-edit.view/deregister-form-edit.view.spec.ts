import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeregisterFormEditView } from './deregister-form-edit.view';

describe('DeregisterFormEditView', () => {
  let component: DeregisterFormEditView;
  let fixture: ComponentFixture<DeregisterFormEditView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeregisterFormEditView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeregisterFormEditView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
