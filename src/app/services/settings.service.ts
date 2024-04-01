
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
            sort: queryParam.sort ? queryParam.sort : Constants.SORT,
            enableTbane: queryParam.enableTbane ? Boolean(queryParam.enableTbane): Constants.ENABLE_TBANE,
            enableBuss: queryParam.enableBuss ? Boolean(queryParam.enableBuss): Constants.ENABLE_BUSS,
            enableTrikk: queryParam.enableTrikk ? Boolean(queryParam.enableTrikk): Constants.ENABLE_TRIKK
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
            sort: queryParam.sort ? queryParam.sort : settingsData.sort,
            enableTbane: queryParam.enableTbane == 'true' ? true : (queryParam.enableTbane == 'false') ? false : settingsData.enableTbane,
            enableBuss: queryParam.enableBuss == 'true' ? true : (queryParam.enableBuss == 'false') ? false : settingsData.enableBuss,
            enableTrikk: queryParam.enableTrikk == 'true' ? true : (queryParam.enableTrikk == 'false') ? false : settingsData.enableTrikk
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

    public sortDestination(settings: SettingsModel, destinationData: DestinationsModel): DestinationsModel {
        switch(settings.sort) {
          case 'realtime':
            this.sortAfterRealTime(destinationData);
            break;
          case 'route-id':
            this.sortAfterRouteID(destinationData);
            break;
        }

        destinationData.destinations.forEach((destination: any) => {
            if(destination.type == Constants.TBANE) {
                destination.visible = settings.enableTbane;
            }
            if(destination.type == Constants.RED_BUSS || destination.type == Constants.GREEN_BUSS) {
                destination.visible = settings.enableBuss;
            }
            if(destination.type == Constants.TRIKK) {
                destination.visible = settings.enableTrikk;
            }
        });
    
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
        const enableTbane = `enableTbane=${settings.enableTbane}`
        const enableBuss = `enableBuss=${settings.enableBuss}`
        const enableTrikk = `enableTrikk=${settings.enableTrikk}`

        this.location.replaceState(`/?${destination}&${direction}&${mergeRoutes}&${detailsMode}&${sort}&${enableTbane}&${enableBuss}&${enableTrikk}`);
    }
    

}