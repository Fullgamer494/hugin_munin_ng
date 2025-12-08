import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsTableView } from './animals-table.view';

describe('AnimalsTableView', () => {
  let component: AnimalsTableView;
  let fixture: ComponentFixture<AnimalsTableView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalsTableView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalsTableView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
