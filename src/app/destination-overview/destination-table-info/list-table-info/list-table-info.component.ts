import { Component, Input } from '@angular/core';
import { DestinationModel } from 'src/app/models/destination.model';
import DestinationsModel from 'src/app/models/destinations.model';

@Component({
  selector: 'list-table-info',
  templateUrl: './list-table-info.component.html',
  styleUrls: ['./list-table-info.component.scss']
})
export class ListTableInfoComponent {
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

  public appendEmptyTimes(n: number): Array<number> { 
    if(n > 2 || n < 0) {
      return [];
    }

    return Array(n); 
  } 

  public pillStyle(routeNumber: string): string {
    if(!isNaN(Number(routeNumber[0]))) {
      return '';
    }

    let numberClass = [];

    for(let i = 0; routeNumber.length > i; i++) {
      if(isNaN(Number(routeNumber[i]))) {
        numberClass.push(routeNumber[i]);
      }
    }

    return `-${numberClass.join('')}`;

  }

  public expandDestinationItem(destinationValue: DestinationModel, index: number): void {
    //this.resetExpand(index);
    const destination = this.destinations.destinations.find(x => x.routeID == destinationValue.routeID && x.destinationName == destinationValue.destinationName);
    if(destination) {
      destination.expanded = !destination.expanded;
    }
  }

  private resetExpand(index: number): void {
    this.destinations.destinations.forEach(x => {
      x.expanded = false;
    })
  }

}
