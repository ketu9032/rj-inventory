import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams, IProfitChartFilter, ISelectedDate } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
    private url = 'api/analysis';
    private profitChartUrl = 'api/analysis/profitChart';
    private saleChartUrl = 'api/analysis/saleChart';
    private purchaseChartUrl = 'api/analysis/purchaseChart';

    constructor(private restService: RestService, private commonService: CommonService) { }

    public getAnalysis(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.url}${queryString}`);
    }
    public profitChart(profitChartFilter: IProfitChartFilter) {
        const queryString = this.commonService.toQueryString(profitChartFilter);
        return this.restService.get(`${this.profitChartUrl}${queryString}`);
    }

    public saleChart(selectedDate: ISelectedDate) {
        const queryString = this.commonService.toQueryString(selectedDate);
        return this.restService.get(`${this.saleChartUrl}${queryString}`);
    }
    public purchaseChart(selectedDate: ISelectedDate) {
        const queryString = this.commonService.toQueryString(selectedDate);
        return this.restService.get(`${this.purchaseChartUrl}${queryString}`);
    }
}
