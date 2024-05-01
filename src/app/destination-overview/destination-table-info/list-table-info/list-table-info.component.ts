import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DestinationModel } from 'src/app/models/destination.model';
import DestinationsModel from 'src/app/models/destinations.model';
import { RouteModel } from 'src/app/models/route.model';

@Component({
  selector: 'list-table-info',
  templateUrl: './list-table-info.component.html',
  styleUrls: ['./list-table-info.component.scss']
})
export class ListTableInfoComponent implements OnChanges{
  destinationsData: DestinationsModel;
  route: RouteModel;
  @Input() vehicle: string;
  @Input() directionEnabled: boolean;
  @Input() centrumDirection: boolean;
  @Input() destinations: DestinationsModel;
  @Input() travelFrom: string;

 
  ngOnChanges(changes: SimpleChanges): void {
    //SET ROUTE MAP HERE from STORAGE
    this.getSavedRouteFromStorageData();
  }

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

  public expandDestinationItem(destinationValue: DestinationModel, route: RouteModel, index: number): void {
    const destination = destinationValue;
    if(destination) {
      if(destination.expanded) {
        destination.expanded = false;
        return;
      }
      else {
        this.resetExpand();
      }
      destination.expanded = true;
      this.route = route;
    }

    this.saveToggleStorageData(destination, index);
  }

  private resetExpand(): void {
    this.destinations.destinations.forEach(x => {
      x.expanded = false;
    })
  }

  private saveToggleStorageData(destinationValue: DestinationModel, index: number): void {
    let toggleStorage: Array<any> = [];
    let routeStorage = {
      index: index,
      routeID: destinationValue.routeID,
      destinationName: destinationValue.destinationName
    };
    this.destinations.destinations.forEach((value: any) => {
      toggleStorage.push({routeID: value.routeID, destinationName: value.destinationName, expanded: value.expanded});
    }) 
    sessionStorage.setItem("destinationToggleData", JSON.stringify(toggleStorage));
    sessionStorage.setItem("destinationRouteData", JSON.stringify(routeStorage));
  }

  private getSavedRouteFromStorageData(): void {
    const routeJSONData = sessionStorage.getItem("destinationRouteData");
    if(routeJSONData) {
      const routeData = JSON.parse(routeJSONData);
      const destination = this.destinations.destinations.find(x => x.routeID === routeData.routeID && x.destinationName == routeData.destinationName);
      if(destination && destination.routeList && destination.routeList.length > 0 && destination.routeList[routeData.index]) {
        this.route = destination.routeList[routeData.index];
      } else {
        if(destination) {
          destination.expanded = false;
        }
      }
    }
  }

}
