import { RouteModel } from "./route.model";

export class DestinationModel {
    routeID: string;
    routeNumber: number;
    routeNumberDisplay: string;
    destinationName: string;
    type: string;
    expanded: boolean;
    routeList: Array<RouteModel>;
}