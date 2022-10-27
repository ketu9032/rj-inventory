
export interface IMatTableParams {
    pageSize: number
    pageNumber: number;
    orderBy: string;
    direction: string;
    search: string;
    active: boolean;
    [key: string]: any;
}
export interface IMatTableParamsWithSearchParams {
    pageSize: number
    pageNumber: number;
    orderBy: string;
    direction: string;
    search: string;
    active: boolean;
    // fromUserId: number;
    // toUserId: number;
    // fromDate: string;
    // toDate: string;
    [key: string]: any;
}

export interface ISelectedDate {
    startDate: any;
    endDate: any;
}


export interface IProfitChartFilter {
    startDate: any;
    endDate: any;
    categories: any;
    suppliers: any;
    items: any;
    customers: any;
}
export interface ISaleChartFilter {
    startDate: any;
    endDate: any;
    categories: any;
    suppliers: any;
    items: any;
    customers: any;
}
export interface IPurchaseChartFilter {
    startDate: any;
    endDate: any;
    categories: any;
    suppliers: any;
    items: any;
    customers: any;
}
