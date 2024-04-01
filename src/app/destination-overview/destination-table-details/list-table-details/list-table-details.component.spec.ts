import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTableDetailsComponent } from './list-table-details.component';

describe('ListTableDetailsComponent', () => {
  let component: ListTableDetailsComponent;
  let fixture: ComponentFixture<ListTableDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTableDetailsComponent]
    });
    fixture = TestBed.createComponent(ListTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
