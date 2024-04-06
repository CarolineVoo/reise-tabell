
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, combineLatest, forkJoin, map, tap, throwError } from 'rxjs';
import * as xml2js from 'xml2js';

@Injectable({
    providedIn: 'root'
})

export class DestinationsService {

    constructor(private http: HttpClient) { }

    public async getDestinationsRUTData():  Promise<any> {
        const apiUrl = 'https://api.entur.io/realtime/v1/rest/et?datasetId=RUT';
        try {
            const destinationsData = this.http.get(apiUrl, { responseType: 'text' }).toPromise();
            return destinationsData;
        } catch (error) {
            console.error('Error fetching data', error);
            throw error;
          }
    }

    public async getDestinationsVYData():  Promise<any> {
        const apiUrl = 'https://api.entur.io/realtime/v1/rest/et?datasetId=BNR';
        try {
            const destinationsData = this.http.get(apiUrl, { responseType: 'text' }).toPromise();
            return destinationsData;
        } catch (error) {
            console.error('Error fetching data', error);
            throw error;
          }
    }

    public async getDestinationsData(): Promise<any>{
        const apiRUTUrl = 'https://api.entur.io/realtime/v1/rest/et?datasetId=RUT';
        const apiVYUrl = 'https://api.entur.io/realtime/v1/rest/et?datasetId=BNR';
        try {
            const [data1, data2] = await Promise.all([
              this.fetchAndConvertXmlToJson(apiRUTUrl),
              this.fetchAndConvertXmlToJson(apiVYUrl)
            ]);

            const mergedDData = [...data1.Siri.ServiceDelivery.EstimatedTimetableDelivery.EstimatedJourneyVersionFrame.EstimatedVehicleJourney, 
                ...data2.Siri.ServiceDelivery.EstimatedTimetableDelivery.EstimatedJourneyVersionFrame.EstimatedVehicleJourney];
            
            return mergedDData;

        } catch (error) {
            throw new Error('Error fetching data: ' + error);
        }
      
    }

    private async fetchAndConvertXmlToJson(url: string): Promise<any> {
        try {
            const response = await this.http.get(url, { responseType: 'text' }).toPromise();
            if (typeof response === 'string') {
              return this.convertXmlToJson(response);
            } else {
              throw new Error('Response is not a string');
            }
          } catch (error) {
            throw new Error('API error: ' + error);
          }
      }


      private convertXmlToJson(xmlString: string): Promise<any> {
        return new Promise((resolve, reject) => {
          xml2js.parseString(xmlString, { explicitArray: false }, (error, result) => {
            if (error) {
              reject('Error parsing XML: ' + error);
            } else {
              resolve(result);
            }
          });
        });
      }

}