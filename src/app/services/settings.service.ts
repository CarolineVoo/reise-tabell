
import { Injectable } from '@angular/core';
import { SettingsModel } from '../models/settings.model';
import { OptionsModel } from '../models/options.model';
import DestinationsModel from '../models/destinations.model';
import { QueryParamModel } from '../models/query-param.model';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class SettingsService {
    private settings: SettingsModel;
    public sortOptions = this.sortingOptions();
    public showSettings: boolean;

    constructor(private location: Location) { }

    //------------------------------------------//
    //           D E F A U L T                 //
    //-----------------------------------------//
    private defaultSettings(queryParam: QueryParamModel): SettingsModel {
        const settings: SettingsModel =  {
            destination: queryParam.destination ? queryParam.destination : 'Veitvet',
            detailsMode: queryParam.detailsMode == 'true',
            sort: queryParam.sort ? queryParam.sort : 'realTime'
        }
        this.updateQueryString(settings);
        return settings;
    }

    private sortingOptions(): Array<OptionsModel> {
        return [
            {
                name: 'Sanntid',
                value: 'realtime'
            },
            {
                name: 'Kjøretøy nummer',
                value: 'route-id'
            }
        ]
    }

    //------------------------------------------//
    //            S E T T I N G S              //
    //-----------------------------------------//

    public setSettings(queryParam: QueryParamModel): SettingsModel {
        const settingsData = sessionStorage.getItem("settingsDate");
        if (!settingsData) {
            return this.defaultSettings(queryParam);
        }
        const settings = JSON.parse(settingsData);
        //this.updateQueryString(settings);
        return settings;
    }

    public onClickSettings() {
        this.showSettings = !this.showSettings;
        var body = document.getElementsByTagName('body')[0];
        if (body) {
            body.style.position = 'fixed';
        }
    }


    public closeSettings(event: boolean) {
        this.showSettings = event;
        var body = document.getElementsByTagName('body')[0];
        if (body) {
            body.style.position = 'relative';
        }
    }

    //------------------------------------------//
    //              S O R T I N G              //
    //-----------------------------------------//

    public sortDestination(sort: string, destinationData: DestinationsModel): DestinationsModel {
        switch(sort) {
          case 'realtime':
            this.sortAfterRealTime(destinationData);
            break;
          case 'route-id':
            this.sortAfterRouteID(destinationData);
            break;
        }
        return destinationData;
      }

    private sortAfterRealTime(destinationData: DestinationsModel)  {
        return destinationData.destinations.sort((b, a) => new Date(b.routeList[0].expectedDepartureTime).getTime() - new Date(a.routeList[0].expectedDepartureTime).getTime());
    }
    
    private sortAfterRouteID(destinationData: DestinationsModel) {
        return destinationData.destinations.sort((a, b) => a.routeNumber - b.routeNumber);
    }

    //------------------------------------------//
    //               O T H E R                 //
    //-----------------------------------------//

    public updateQueryString(settings: SettingsModel): void {
        this.location.replaceState(`/?destination=${settings.destination}&detailsMode=${settings.detailsMode}&sort=${settings.sort}`);
    }
    

}