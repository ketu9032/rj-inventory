import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { ISalesQuotationDetailsParams } from 'src/app/models/sales-quotation-details';

@Injectable({ providedIn: 'root' })
export class salesQuotationDetailsService {
    private salesQuotationDetailsURL = 'api/sales_quotation_detail';

    constructor(
        private restService: RestService,
        private commonService: CommonService
        ) { }

    public getSalesQuotationDetail(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.salesQuotationDetailsURL}${queryString}`);
    }
    public addSalesQuotationDetail(salesQuotationDetails: ISalesQuotationDetailsParams) {
        return this.restService.post(`${this.salesQuotationDetailsURL}`, salesQuotationDetails);
    }
    public editSalesQuotationDetail(salesQuotationDetails: ISalesQuotationDetailsParams) {
        return this.restService.put(`${this.salesQuotationDetailsURL}`, salesQuotationDetails);
    }
    public removeSalesQuotationDetail(id: string) {
        return this.restService.delete(`${this.salesQuotationDetailsURL}?id=${id}`);
    }

}


