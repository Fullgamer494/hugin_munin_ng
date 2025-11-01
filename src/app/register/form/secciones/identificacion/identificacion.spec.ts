import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Identificacion } from './identificacion';

describe('Identificacion', () => {
  let component: Identificacion;
  let fixture: ComponentFixture<Identificacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Identificacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Identificacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
