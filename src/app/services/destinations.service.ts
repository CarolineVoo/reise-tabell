
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class DestinationsService {

    constructor(private http: HttpClient) { }

    public async getDestinationsData():  Promise<any> {
        const apiUrl = 'https://api.entur.io/realtime/v1/rest/et?datasetId=RUT';
        try {
            const destinationsData = this.http.get(apiUrl, { responseType: 'text' }).toPromise();
            return destinationsData;
        } catch (error) {
            console.error('Error fetching data', error);
            throw error;
          }
    }

    // public async getDestinationsVYData():  Promise<any> {
    //     const apiUrl = 'https://api.entur.io/realtime/v1/rest/et?datasetId=NSB';
    //     try {
    //         const destinationsData = this.http.get(apiUrl, { responseType: 'text' }).toPromise();
    //         return destinationsData;
    //     } catch (error) {
    //         console.error('Error fetching data', error);
    //         throw error;
    //       }
    // }

}