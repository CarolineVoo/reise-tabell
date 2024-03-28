
import { Injectable } from '@angular/core';
import { SettingsModel } from '../models/settings.model';
import { OptionsModel } from '../models/options.model';
import DestinationsModel from '../models/destinations.model';

@Injectable({
    providedIn: 'root'
})

export class SettingsService {
    private settings: SettingsModel;
    public sortOptions = this.sortingOptions();
    public showSettings: boolean;

    constructor() { }

    //------------------------------------------//
    //           D E F A U L T                 //
    //-----------------------------------------//
    private defaultSettings(): SettingsModel {
        return {
            destination: 'Veitvet',
            detailsMode: false,
            sort: 'realtime'
        }
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

    public setSettings(): SettingsModel {
        const settingsData = sessionStorage.getItem("settingsDate");
        if (!settingsData) {
            return this.defaultSettings();
        }
        return JSON.parse(settingsData);
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
    

}