import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import DestinationsModel from 'src/app/models/destinations.model';

@Component({
  selector: 'destination-table-info',
  templateUrl: './destination-table-info.component.html',
  styleUrls: ['./destination-table-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationTableInfoComponent {
  destinations: DestinationsModel;
  isActive: boolean;

  @Input() title: string;
  @Input() type: string;
  @Input() vehicle: string;

  @Input() set destinationsData(value: string) {
    if(!value) {
      return;
    }
    this.destinations = JSON.parse(value);
    this.isActive = this.setTableActive(this.destinations);
  }

  public vehicleType(value: string): boolean {
    return this.vehicle.includes(value)
  }

  public appendEmptyTimes(n: number): Array<number> { 
    if(n > 2 || n < 0) {
      return [];
    }

    return Array(n); 
  } 

  private setTableActive(destinations: DestinationsModel): boolean { 
    let active = false;
    destinations.destinations.forEach(route => {
      if(this.vehicleType(route.type)){
        active = true;
      }
    });
    return active;
  }

}
