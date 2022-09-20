import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IItemActiveParams, IItemParams } from 'src/app/models/item';
import { ISalesQuotationActiveParams, ISalesQuotationParams } from 'src/app/models/sales-quotation';
import { ISalesQuotationToSalesParams } from 'src/app/models/sales';


@Injectable({ providedIn: 'root' })
export class salesQuotationService {
    private salesQuotationURL = 'api/sales_quotation';
    private addSalesURL = 'api/addSales';
    private changeStatusURL = 'api/sales_quotation/changeStatus';
    private getCdfToCustomerDropDownURL = 'api/cdf/getCdfTOCustomerDropDown';
    private getItemDropDownURL = 'api/item/getItemDropDown';
    private getSalesQuotationPrintURL= 'api/sales_quotation/salesQuotationPrint';

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
    public addSalesQuotationToSales(sales: ISalesQuotationToSalesParams) {
        return this.restService.post(`${this.addSalesURL}`, sales);
    }
    public editSalesQuotation(item: ISalesQuotationParams) {
        return this.restService.put(`${this.salesQuotationURL}`, item);
    }
    public removeSalesQuotation(id: string) {
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

    public salesQuotationPrint(salesQuotationId: number) {
        return this.restService.get<any>(`${this.getSalesQuotationPrintURL}?salesQuotationId=${salesQuotationId}`);
         }
}


