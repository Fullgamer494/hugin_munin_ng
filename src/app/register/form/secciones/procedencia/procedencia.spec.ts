import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Procedencia } from './procedencia';

describe('Procedencia', () => {
  let component: Procedencia;
  let fixture: ComponentFixture<Procedencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Procedencia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Procedencia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
