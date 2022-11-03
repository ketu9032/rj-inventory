import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams, ISelectedDate } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IDashboardDaysParams } from 'src/app/models/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private todaySummaryUrl = 'api/dashboard/todaySummary';
    private customerChartUrl = 'api/dashboard/customerChart';
    private supplierChartUrl = 'api/dashboard/supplierChart';

    private monthWiseUrl = 'api/dashboard/monthWiseData';
    private companyBalanceUrl = 'api/dashboard/companyBalance';



    constructor(private restService: RestService, private commonService: CommonService) { }


    public todaySummary() {
        return this.restService.get<any>(`${this.todaySummaryUrl}`);
    }
    public customerChart() {
        return this.restService.get<any>(`${this.customerChartUrl}`);
    }
    public supplierChart() {
        return this.restService.get<any>(`${this.supplierChartUrl}`);
    }
    public monthWiseData() {
        return this.restService.get<any>(`${this.monthWiseUrl}`);
    }
    public companyBalance() {
        return this.restService.get<any>(`${this.companyBalanceUrl}`);
    }


}
