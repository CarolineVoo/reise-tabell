import { Component, Input } from '@angular/core';
import { DestinationModel } from 'src/app/models/destination.model';
import DestinationsModel from 'src/app/models/destinations.model';

@Component({
  selector: 'list-table-details',
  templateUrl: './list-table-details.component.html',
  styleUrls: ['./list-table-details.component.scss']
})
export class ListTableDetailsComponent {
  destinationsData: DestinationsModel;

  @Input() vehicle: string;
  @Input() directionEnabled: boolean;
  @Input() centrumDirection: boolean;
  @Input() destinations: DestinationsModel;
  @Input() travelFrom: string;

  public displayList(value: string, towardsCenter: boolean): boolean {
    if(this.directionEnabled && this.centrumDirection == towardsCenter && !this.vehicle) {
      return true;
    }

    if(this.directionEnabled && !this.centrumDirection != towardsCenter && !this.vehicle) {
      return true;
    }

    if(!this.vehicle && !this.directionEnabled) {
      return true;
    }

    if(!this.directionEnabled && this.vehicle.includes(value)){
      return true;
    }

    if(this.directionEnabled && this.centrumDirection == towardsCenter && this.vehicle.includes(value)) {
      return true;
    }

    if(this.directionEnabled && !this.centrumDirection != towardsCenter && this.vehicle.includes(value)) {
      return true;
    }

    return false;
  }

  public vehicleType(value: string): boolean {
    if(!this.vehicle) {
      return true;
    }

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

}
