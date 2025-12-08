import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalDetailsView } from './animal-details.view';

describe('AnimalDetailsView', () => {
  let component: AnimalDetailsView;
  let fixture: ComponentFixture<AnimalDetailsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalDetailsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalDetailsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
