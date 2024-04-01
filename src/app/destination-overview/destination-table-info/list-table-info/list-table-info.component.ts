import { Component, Input } from '@angular/core';
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

}
