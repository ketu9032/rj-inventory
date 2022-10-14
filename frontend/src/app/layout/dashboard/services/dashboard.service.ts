import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams, ISelectedDate } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class DashboardService {


    // private url = 'api/analysis';
    private dayWiseSalesAndProfitChartUrl = 'api/dashboard/dayWiseSalesAndProfitChart';
    // private saleChartUrl = 'api/analysis/saleChart';
    // private purchaseChartUrl = 'api/analysis/purchaseChart';

    constructor(private restService: RestService, private commonService: CommonService) { }

    // public getAnalysis(tablePrams: IMatTableParams) {
    //     const queryString = this.commonService.toQueryString(tablePrams);
    //     return this.restService.get<any>(`${this.url}${queryString}`);
    // }
    public dayWiseSalesAndProfitChart(selectedDate: ISelectedDate) {
        const queryString = this.commonService.toQueryString(selectedDate);
        return this.restService.get(`${this.dayWiseSalesAndProfitChartUrl}${queryString}`);
    }

    // public saleChart(selectedDate: ISelectedDate) {
    //     const queryString = this.commonService.toQueryString(selectedDate);
    //     return this.restService.get(`${this.saleChartUrl}${queryString}`);
    // }
    // public purchaseChart(selectedDate: ISelectedDate) {
    //     const queryString = this.commonService.toQueryString(selectedDate);
    //     return this.restService.get(`${this.purchaseChartUrl}${queryString}`);
    // }
}
