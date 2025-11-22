import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deregister } from './deregister';

describe('Deregister', () => {
  let component: Deregister;
  let fixture: ComponentFixture<Deregister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deregister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deregister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
