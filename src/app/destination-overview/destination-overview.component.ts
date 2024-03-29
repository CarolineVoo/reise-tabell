import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as xml2js from 'xml2js';
import { DestinationsService } from 'src/app/services/destinations.service';
import DestinationsModel from '../models/destinations.model';
import { DestinationModel } from '../models/destination.model';
import { SettingsModel } from '../models/settings.model';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'destination-overview',
  templateUrl: './destination-overview.component.html',
  styleUrls: ['./destination-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationOverviewComponent implements OnInit {
  @ViewChild('overviewElement') overviewElement: ElementRef;
  
  destinationsData: DestinationsModel;
  destinationDataJSON: string;
  settings: SettingsModel;
  settingsDataJSON: string;
  loading: boolean;

  constructor(
    public destinationsService: DestinationsService, 
    public settingsService: SettingsService,
    private cdr: ChangeDetectorRef, 
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loading = true;
    sessionStorage.removeItem("destinationToggleData");
    this.initDestinationModel();
    this.getDestinationsData();
    setInterval(()=> {
      this.getDestinationsData();
    }, 16000);

    setInterval(()=> {
      location.reload();
    }, 300000);
  }

  private initDestinationModel() {
    this.destinationsData = new DestinationsModel;
    this.destinationsData.destinations = new Array<DestinationModel>;
  }

  public async getDestinationsData() {
    try {
      const data = await this.destinationsService.getDestinationsData();
      const json = await this.convertXmlToJson(data);
      this.settings = this.settingsService.setSettings();
      this.destinationsData = this.getRuterData(json);
      this.destinationDataJSON = JSON.stringify(this.destinationsData);
      this.settingsDataJSON = JSON.stringify(this.settings);
    } catch (error) {
      console.error('Error loading data in component', error);
    } finally {
      this.loading = false;
      this.setZoomStyle();
      this.cdr.detectChanges();
      console.log(this.destinationsData);
    }
  }

  private convertXmlToJson(xmlData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xmlData, { explicitArray: false }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  private getRuterData(data: any): DestinationsModel{
    const routeList = data.Siri?.ServiceDelivery?.EstimatedTimetableDelivery?.EstimatedJourneyVersionFrame?.EstimatedVehicleJourney;

    if(routeList.length <= 0) {
      return new DestinationsModel;
    }
    this.resetRouteListForDestinations()
    routeList.forEach((routes: any) => {
      if(Array.isArray(routes.EstimatedCalls?.EstimatedCall)) {
        routes?.EstimatedCalls?.EstimatedCall.forEach((x: any) => {
          if(x.StopPointName == this.settings.destination) {
            this.destinationsData = this.mapDestinationValue(routes, x);
          }
        });
      }
    });
    this.sortDepartureDate();
    this.destinationsData = this.settingsService.sortDestination(this.settings.sort, this.destinationsData);
    return this.destinationsData;
  }

  private mapDestinationValue(routeData: any, destinationRoute: any): DestinationsModel {
    let routeAlreadyExists = this.destinationsData.destinations.find(x => x.routeID === routeData.LineRef && x.destinationName === destinationRoute.DestinationDisplay);

    if(this.isMinuteValid(destinationRoute.ExpectedDepartureTime)){
      if(!routeAlreadyExists) {
        this.destinationsData.destinations.push({ 
          routeID: routeData.LineRef,
          routeNumber: this.setRouteNumber(routeData.LineRef), 
          routeNumberDisplay: this.setRouteNumberDisplay(routeData.LineRef),
          destinationName: destinationRoute.DestinationDisplay,
          type: this.setTypeOfVehicle(routeData.LineRef), 
          expanded: this.getSaveToggleData(routeData.LineRef, destinationRoute.DestinationDisplay),
          routeList: [this.setRouteModel(destinationRoute)]
        })
      } else {
        this.destinationsData.destinations.forEach( x => {
          if(x.routeID === routeAlreadyExists?.routeID && x.destinationName === routeAlreadyExists?.destinationName) {
            x.expanded = this.getSaveToggleData(routeData.LineRef, destinationRoute.DestinationDisplay);
            if(x.routeList.length >= 5) {
              return;
            }
            x.routeList.push(this.setRouteModel(destinationRoute));
          }
        });
      }
    }
    return this.destinationsData;
  }

  private setRouteModel(destinationRoute: any) {
    return  {
      departureStatus: destinationRoute.DepartureStatus,
      departureStatusDisplay: this.setStatusText(destinationRoute.DepartureStatus),
      aimedArrivalTime: destinationRoute.AimedArrivalTime,
      aimedDepartureTime: destinationRoute.AimedDepartureTime,
      expectedArrivalTime: destinationRoute.ExpectedArrivalTime,
      expectedDepartureTime: destinationRoute.ExpectedDepartureTime,
      realTime: this.setRealTimeDeparture(destinationRoute.ExpectedDepartureTime, destinationRoute.DepartureStatus)
    }
  }

  private setRouteNumber(routeId: string): number {
    const routeIdSplits = routeId.split(":");
    const routeNumber = routeIdSplits[routeIdSplits.length - 1]
    if(Number(routeNumber) > 2000) {
      return Number(routeNumber.slice(2,4));
    } 
    return Number(routeNumber);
  }

  private setRouteNumberDisplay(routeId: string): string {
    const routeIdSplits = routeId.split(":");
    const routeNumber = routeIdSplits[routeIdSplits.length - 1]
    
    if(Number(routeNumber) > 2000) {
      return `${routeNumber.slice(2,4)}E`;
    } 
    return routeNumber;
  }

  private setTypeOfVehicle(routeId: string): string {
    const routeIdSplits = routeId.split(":");
    const routeNumber = routeIdSplits[routeIdSplits.length - 1];

    if(Number(routeNumber) < 6) {
      return "tbane"
    } else if(Number(routeNumber) < 20) { 
      return "trikk"
    }else if(Number(routeNumber) < 100 || Number(routeNumber) > 2000) {
      return "redbuss"
    } else {
      return "greenbuss"
    }
  }

  private sortDepartureDate() {
    if(this.destinationsData.destinations.length <= 0) {
      return;
    }
    this.destinationsData.destinations.forEach(destination => {
      destination.routeList.sort((b, a) => new Date(b.aimedArrivalTime).getTime() - new Date(a.aimedArrivalTime).getTime());
    });
  }

  private resetRouteListForDestinations(): void {
    this.destinationsData.destinations.forEach(destination => {
      destination.routeList = [];
    });
  }

  private setRealTimeDeparture(expectedDepartureTime: string, departureStatus: string): string {
    if(departureStatus === "cancelled") {
      return "";
    }
    const today = new Date();
    const expectedTime = new Date(expectedDepartureTime);
    const diffMs = expectedTime.valueOf() - today.valueOf();
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    const diffSecs = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000);

    if(diffMins == 0 && diffSecs <= 40 ) {
      return 'nå';
    }

    if(diffMins > 15 || diffHrs > 0) {
      let hours = expectedTime.getHours() > 9 ? expectedTime.getHours() : `0${expectedTime.getHours()}`;
      let minutes = expectedTime.getMinutes() > 9 ? expectedTime.getMinutes() : `0${expectedTime.getMinutes()}`;
      return `${hours}:${minutes}`;
    }

    return `${diffMins.toString()} min`;
  }

  private isMinuteValid(expectedDepartureTime: string): boolean {
    const today = new Date().valueOf();
    const expectedTime = new Date(expectedDepartureTime).valueOf();
    const diffMs = expectedTime - today;
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if(diffMins < 0) {
      return false;
    }
    return true;
  }

  public getClock(): string {
    const today = new Date();
    let minutes = today.getMinutes().toString();
    let hours = today.getHours().toString();
    if(today.getMinutes() < 10) {
      minutes = `0${today.getMinutes()}`
    }
    if(today.getHours() < 10) {
      hours = `0${today.getHours()}`
    }
    return `${hours}:${minutes}`
  }

  private setStatusText(status: string): string {
    switch(status) {
      case "onTime":
        return "I rute";
      case "delayed":
        return "Forsinket";
      case "cancelled":
        return "Kansellert"
    }
    return "";
  }

  onChangeSetting(event: string): void {
    if(!event) {
      return;
    }
    this.settings = JSON.parse(event);
    this.destinationsData = this.settingsService.sortDestination(this.settings.sort, this.destinationsData);
    this.destinationDataJSON = JSON.stringify(this.destinationsData);
  }

  private getSaveToggleData(routeID: string, destinationName: string): boolean {
    const savedData = sessionStorage.getItem("destinationToggleData");

    if(!savedData) {
      return false;
    }
  
    const destinationsList = JSON.parse(savedData);
    let destination = destinationsList.find((x: any) => x.routeID === routeID && x.destinationName === destinationName);
    if(destination) {
      return destination.expanded;
    }
    return false;
  }

  private setZoomStyle(): void {
    const numberOfDestinations = this.destinationsData.destinations.length;
    if(numberOfDestinations < 20) {
      this.renderer.setAttribute(this.overviewElement.nativeElement, 'class', 'destination-overview__zoom--large');
    }
  }

}
