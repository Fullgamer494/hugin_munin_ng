import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBaja } from './datos-baja';

describe('DatosBaja', () => {
  let component: DatosBaja;
  let fixture: ComponentFixture<DatosBaja>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosBaja]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosBaja);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
