import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationTableInfoComponent } from './destination-table-info.component';

describe('DestinationTableInfoComponent', () => {
  let component: DestinationTableInfoComponent;
  let fixture: ComponentFixture<DestinationTableInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationTableInfoComponent]
    });
    fixture = TestBed.createComponent(DestinationTableInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
