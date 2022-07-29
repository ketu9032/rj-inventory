import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IItemActiveParams, IItemParams } from 'src/app/models/item';
import { ISalesQuotationActiveParams, ISalesQuotationParams } from 'src/app/models/sales-quotation';


@Injectable({ providedIn: 'root' })
export class salesQuotationService {
    private salesQuotationURL = 'api/sales_quotation';
    private changeStatusURL = 'api/sales_quotation/changeStatus';


    constructor(
        private restService: RestService,
         private commonService: CommonService
    ) { }

    public getItems(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.salesQuotationURL}${queryString}`);
    }
    public addSales(item: ISalesQuotationParams) {
        return this.restService.post(`${this.salesQuotationURL}`, item);
    }
    public editSales(item: ISalesQuotationParams) {
        return this.restService.put(`${this.salesQuotationURL}`, item);
    }
    public removeItems(id: string) {
        return this.restService.delete(`${this.salesQuotationURL}?id=${id}`);
    }
    public changeStatus(item: ISalesQuotationActiveParams) {
        return this.restService.put(`${this.changeStatusURL}`, item);
    }


}


