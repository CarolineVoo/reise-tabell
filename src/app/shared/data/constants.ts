export class Constants {
    //DEFAULT SETTINGS
    public static DESTINATION = "Veitvet";
    public static DIRECTION = true;
    public static MERGE_ROUTES = false;
    public static DETAILS_MODE = false;
    public static SORT = "realtime"
    public static ENABLE_TBANE = true;
    public static ENABLE_BUSS = true;
    public static ENABLE_TRIKK = true;

    //QUERY PARAMETER
    public static QUERY_PARAM_DESTINATION = "destination";
    public static QUERY_PARAM_DIRECTION = "direction";
    public static QUERY_PARAM_MERGE_ROUTES = "mergeRoutes";
    public static QUERY_PARAM_DETAILS_MODE = "detailsMode";
    public static QUERY_PARAM_SORT= "sort";
    public static QUERY_PARAM_ENABLE_TBANE = "enableTbane";
    public static QUERY_PARAM_ENABLE_BUSS = "enableBuss";
    public static QUERY_PARAM_ENABLE_TRIKK = "enableTrikk";

    //SERVICES
    public static LOADING_TIME = 300000;
    public static API_CALL_TIME = 16000;

    //DATA
    public static TBANE = "tbane";
    public static RED_BUSS = "redbuss";
    public static GREEN_BUSS = "greenbuss";
    public static TRIKK = "trikk";
    public static TOG = "tog";
    public static FLY_TOG = "flytog";

    public static STATUS_ON_TIME = "onTime";
    public static STATUS_DELAYED = "delayed";
    public static STATUS_CANCELLED = "cancelled";
}