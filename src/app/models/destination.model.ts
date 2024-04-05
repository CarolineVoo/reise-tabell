import { RouteModel } from "./route.model";

export class DestinationModel {
    travelFrom: string;
    routeID: string;
    routeNumber: number;
    routeNumberDisplay: string;
    destinationName: string;
    type: string;
    towardsCenter: boolean;
    visible: boolean;
    expanded: boolean;
    routeList: Array<RouteModel>;
}