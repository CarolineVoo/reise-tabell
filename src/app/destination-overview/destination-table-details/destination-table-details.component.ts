import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DestinationModel } from 'src/app/models/destination.model';
import DestinationsModel from 'src/app/models/destinations.model';

@Component({
  selector: 'destination-table-details',
  templateUrl: './destination-table-details.component.html',
  styleUrls: ['./destination-table-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationTableDetailsComponent {

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


  public expandDestinationItem(destinationValue: DestinationModel): void {
    const destination = this.destinations.destinations.find(x => x.routeID == destinationValue.routeID && x.destinationName == destinationValue.destinationName);
    if(destination) {
      destination.expanded = !destination.expanded;
      this.saveToggleStorageData();
    }
  }

  private saveToggleStorageData(): void {
    let toggleStorage: Array<any> = [];
    this.destinations.destinations.forEach((value: any) => {
      toggleStorage.push({routeID: value.routeID, destinationName: value.destinationName, expanded: value.expanded});
    }) 
    sessionStorage.setItem("destinationToggleData", JSON.stringify(toggleStorage));
  }

  public appendEmptyTimes(n: number): Array<number> { 
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
