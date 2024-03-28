import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationTableDetailsComponent } from './destination-table-details.component';

describe('DestinationTableDetailsComponent', () => {
  let component: DestinationTableDetailsComponent;
  let fixture: ComponentFixture<DestinationTableDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationTableDetailsComponent]
    });
    fixture = TestBed.createComponent(DestinationTableDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
