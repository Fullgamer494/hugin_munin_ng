import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Descriptiva } from './descriptiva';

describe('Descriptiva', () => {
  let component: Descriptiva;
  let fixture: ComponentFixture<Descriptiva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Descriptiva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Descriptiva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
