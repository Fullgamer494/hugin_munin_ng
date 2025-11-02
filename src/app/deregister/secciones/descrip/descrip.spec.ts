import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionDescriptivaBaja } from './descrip';

describe('Descrip', () => {
  let component: InformacionDescriptivaBaja;
  let fixture: ComponentFixture<InformacionDescriptivaBaja>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionDescriptivaBaja]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionDescriptivaBaja);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
