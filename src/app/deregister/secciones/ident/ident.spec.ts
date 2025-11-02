import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificacionBaja } from './ident';

describe('Ident', () => {
  let component: IdentificacionBaja;
  let fixture: ComponentFixture<IdentificacionBaja>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentificacionBaja]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentificacionBaja);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
