import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovalsTableView } from './removals-table.view';

describe('RemovalsTableView', () => {
  let component: RemovalsTableView;
  let fixture: ComponentFixture<RemovalsTableView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemovalsTableView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemovalsTableView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
