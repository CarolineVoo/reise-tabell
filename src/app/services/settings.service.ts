
import { Injectable } from '@angular/core';
import { SettingsModel } from '../models/settings.model';
import { OptionsModel } from '../models/options.model';
import DestinationsModel from '../models/destinations.model';
import { QueryParamModel } from '../models/query-param.model';
import { Location } from '@angular/common';
import { Constants } from '../shared/data/constants';

@Injectable({
    providedIn: 'root'
})

export class SettingsService {
    public sortOptions = this.sortingOptions();
    public showSettings: boolean;

    constructor(private location: Location) { }

    //------------------------------------------//
    //           D E F A U L T                 //
    //-----------------------------------------//
    private defaultSettings(queryParam: QueryParamModel): SettingsModel {
        const settings: SettingsModel =  {
            destination: queryParam.destination ? queryParam.destination : Constants.DESTINATION,
            direction: queryParam.direction ? Boolean(queryParam.direction) : Constants.DIRECTION,
            mergeRoutes: queryParam.mergeRoutes ? Boolean(queryParam.mergeRoutes) : Constants.MERGE_ROUTES,
            detailsMode: queryParam.detailsMode ? Boolean(queryParam.detailsMode) : Constants.DETAILS_MODE,
            sort: queryParam.sort ? queryParam.sort : Constants.SORT
        }
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
        let settings;
        if (!settingsData) {
            settings = this.defaultSettings(queryParam);
        } else {
            settings = this.savedSettings(queryParam, JSON.parse(settingsData))
        }
        sessionStorage.setItem("settingsDate", JSON.stringify(settings));
        return settings;
    }

    private savedSettings(queryParam: QueryParamModel, settingsData: SettingsModel): SettingsModel {
        const settings: SettingsModel =  {
            destination: queryParam.destination ? queryParam.destination : settingsData.destination,
            direction: queryParam.direction == 'true' ? true : (queryParam.direction == 'false') ? false : settingsData.direction,
            mergeRoutes: queryParam.mergeRoutes == 'true' ? true : (queryParam.mergeRoutes == 'false') ? false : settingsData.mergeRoutes,
            detailsMode: queryParam.detailsMode == 'true' ? true : (queryParam.detailsMode == 'false') ? false : settingsData.detailsMode,
            sort: queryParam.sort ? queryParam.sort : settingsData.sort
        }
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
        const destination = `destination=${settings.destination}`
        const direction = `direction=${settings.direction}`
        const mergeRoutes = `mergeRoutes=${settings.mergeRoutes}`
        const detailsMode = `detailsMode=${settings.detailsMode}`
        const sort = `sort=${settings.sort}`
        this.location.replaceState(`/?${destination}&${direction}&${mergeRoutes}&${detailsMode}&${sort}`);
    }
    

}