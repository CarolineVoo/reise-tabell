import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as xml2js from 'xml2js';
import { DestinationsService } from 'src/app/services/destinations.service';
import DestinationsModel from '../models/destinations.model';
import { DestinationModel } from '../models/destination.model';
import { SettingsModel } from '../models/settings.model';
import { SettingsService } from '../services/settings.service';
import { ActivatedRoute } from '@angular/router';
import { QueryParamModel } from '../models/query-param.model';
import { Constants } from '../shared/data/constants';

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
  destination: string;

  constructor(
    public destinationsService: DestinationsService, 
    public settingsService: SettingsService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getQueryParamDataFromUrl();
    this.loading = true;
    sessionStorage.removeItem("destinationToggleData");
    this.initDestinationModel();
    this.getDestinationsData();
    setInterval(()=> {
      this.getDestinationsData();
    }, Constants.API_CALL_TIME);

    setInterval(()=> {
      location.reload();
    }, Constants.LOADING_TIME);
  }

  private initDestinationModel() {
    this.destinationsData = new DestinationsModel;
    this.destinationsData.destinations = new Array<DestinationModel>;
  }

  public async getDestinationsData() {
    try {
      const data = await this.destinationsService.getDestinationsData();
      const json = await this.convertXmlToJson(data);
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
    this.destinationsData = this.settingsService.sortDestination(this.settings, this.destinationsData);
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
          towardsCenter: this.setTowardsCentrum(routeData),
          visible: true,
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
      return Constants.TBANE
    } else if(Number(routeNumber) < 20) { 
      return Constants.TRIKK
    }else if(Number(routeNumber) < 100 || Number(routeNumber) > 2000) {
      return Constants.RED_BUSS
    } else {
      return Constants.GREEN_BUSS
    }
  }

  private setTowardsCentrum(routeData: any): boolean {
    let isTowardsCentrum = false;
    let indexPositionCentrum = 0;
    let indexPositionDestination = 0;
    routeData.EstimatedCalls.EstimatedCall.forEach((route: any, index: number) => {
      if(route.StopPointName === 'Jernbanetorget' || route.StopPointName === 'Oslo bussterminal' 
      || route.StopPointName === 'Majorstuen' || route.StopPointName === 'Tollboden') {
        indexPositionCentrum = index;
      }
      if(route.StopPointName === this.settings.destination) {
        indexPositionDestination = index;
      }
    });
    if(indexPositionCentrum > indexPositionDestination) {
      isTowardsCentrum = true;
    }
    return isTowardsCentrum;
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
      case Constants.STATUS_ON_TIME:
        return "I rute";
      case Constants.STATUS_DELAYED:
        return "Forsinket";
      case Constants.STATUS_CANCELLED:
        return "Kansellert"
    }
    return "";
  }

  onChangeSetting(event: string): void {
    if(!event) {
      return;
    }
    this.settings = JSON.parse(event);
    this.destinationsData = this.settingsService.sortDestination(this.settings, this.destinationsData);
    this.destinationDataJSON = JSON.stringify(this.destinationsData);
    this.settingsService.updateQueryString(this.settings);
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

  private getQueryParamDataFromUrl(): void {
    this.route.queryParams.subscribe(params => {
      const queryParam: QueryParamModel = new QueryParamModel();
      if(params[Constants.QUERY_PARAM_DESTINATION]) {
        queryParam.destination = params[Constants.QUERY_PARAM_DESTINATION];
      }
      if(params[Constants.QUERY_PARAM_DIRECTION]) {
        queryParam.direction = params[Constants.QUERY_PARAM_DIRECTION];
      }
      if(params[Constants.QUERY_PARAM_MERGE_ROUTES]) {
        queryParam.mergeRoutes = params[Constants.QUERY_PARAM_MERGE_ROUTES];
      }
      if(params[Constants.QUERY_PARAM_DETAILS_MODE]) {
        queryParam.detailsMode = params[Constants.QUERY_PARAM_DETAILS_MODE];
      }
      if(params[Constants.QUERY_PARAM_SORT]) {
        queryParam.sort = params[Constants.QUERY_PARAM_SORT];
      }
      if(params[Constants.QUERY_PARAM_ENABLE_TBANE]) {
        queryParam.enableTbane = params[Constants.QUERY_PARAM_ENABLE_TBANE];
      }
      if(params[Constants.QUERY_PARAM_ENABLE_BUSS]) {
        queryParam.enableBuss = params[Constants.QUERY_PARAM_ENABLE_BUSS];
      }
      if(params[Constants.QUERY_PARAM_ENABLE_TRIKK]) {
        queryParam.enableTrikk = params[Constants.QUERY_PARAM_ENABLE_TRIKK];
      }
      this.settings = this.settingsService.setSettings(queryParam);
    });
  }

}
