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
    private getCdfToCustomerDropDownURL = 'api/cdf/getCdfTOCustomerDropDown';
    private getItemDropDownURL  = 'api/item/getItemDropDown';

    constructor(
        private restService: RestService,
         private commonService: CommonService
    ) { }

    public getSalesQuotation(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.salesQuotationURL}${queryString}`);
    }
    public addSalesQuotation(item: ISalesQuotationParams) {
        return this.restService.post(`${this.salesQuotationURL}`, item);
    }
    public editSalesQuotation(item: ISalesQuotationParams) {
        return this.restService.put(`${this.salesQuotationURL}`, item);
    }
    public removeItemsQuotation(id: string) {
        return this.restService.delete(`${this.salesQuotationURL}?id=${id}`);
    }
    public changeStatus(item: ISalesQuotationActiveParams) {
        return this.restService.put(`${this.changeStatusURL}`, item);
    }
    public getCustomerDropDown() {
        return this.restService.get<any>(`${this.getCdfToCustomerDropDownURL}`);
      }
      public getItemDropDown() {
        return this.restService.get<any>(`${this.getItemDropDownURL}`);
      }

}


