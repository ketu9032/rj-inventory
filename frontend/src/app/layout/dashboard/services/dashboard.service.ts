import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams, ISelectedDate } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class DashboardService {


    private todaySummaryUrl = 'api/dashboard/todaySummary';

    // private saleChartUrl = 'api/analysis/saleChart';
    // private purchaseChartUrl = 'api/analysis/purchaseChart';

    constructor(private restService: RestService, private commonService: CommonService) { }

    public todaySummary() {
        return this.restService.get<any>(`${this.todaySummaryUrl}`);
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
