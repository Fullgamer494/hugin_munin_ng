import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemovalsTableView } from './removals-table.view';
import { EspecimenService } from '../../../api/application/especimen.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('RemovalsTableView', () => {
  let component: RemovalsTableView;
  let fixture: ComponentFixture<RemovalsTableView>;
  let mockEspecimenService: any;

  beforeEach(async () => {
    mockEspecimenService = {
      getAllRegistrosBaja: jasmine.createSpy('getAllRegistrosBaja').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [RemovalsTableView],
      providers: [
        { provide: EspecimenService, useValue: mockEspecimenService },
        { provide: ActivatedRoute, useValue: {} }
      ]
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
