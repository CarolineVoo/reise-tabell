import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import DestinationsModel from 'src/app/models/destinations.model';
import { SettingsModel } from 'src/app/models/settings.model';

@Component({
  selector: 'destination-table-info',
  templateUrl: './destination-table-info.component.html',
  styleUrls: ['./destination-table-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationTableInfoComponent implements OnInit {
  destinations: DestinationsModel;
  isActive: boolean;

  @Input() title: string;
  @Input() type: string;
  @Input() vehicle: string;
  @Input() direction: boolean;
  @Input() travelFrom: string;

  @Input() set destinationsData(value: string) {
    if(!value) {
      return;
    }
    this.destinations = JSON.parse(value);
    this.isActive = this.setTableActive(this.destinations);
  }

  ngOnInit(): void {
    this.isActive = this.setTableActive(this.destinations);
  }

  public vehicleType(value: string): boolean {
    if(!this.vehicle) {
      return true;
    }
    return this.vehicle.includes(value)
  }

  private setTableActive(destinations: DestinationsModel): boolean { 
    let active = false;
    destinations.destinations.forEach(route => {
      if((this.vehicleType(route.type) && route.visible) && route.travelFrom == this.travelFrom) {
        active = true;
      }
    });
    return active;
  }

}
