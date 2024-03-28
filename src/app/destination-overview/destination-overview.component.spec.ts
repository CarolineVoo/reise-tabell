import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationOverviewComponent } from './destination-overview.component';

describe('DestinationOverviewComponent', () => {
  let component: DestinationOverviewComponent;
  let fixture: ComponentFixture<DestinationOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationOverviewComponent]
    });
    fixture = TestBed.createComponent(DestinationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
