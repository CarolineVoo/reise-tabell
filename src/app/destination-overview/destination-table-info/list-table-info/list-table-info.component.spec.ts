import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTableInfoComponent } from './list-table-info.component';

describe('ListTableInfoComponent', () => {
  let component: ListTableInfoComponent;
  let fixture: ComponentFixture<ListTableInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTableInfoComponent]
    });
    fixture = TestBed.createComponent(ListTableInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
