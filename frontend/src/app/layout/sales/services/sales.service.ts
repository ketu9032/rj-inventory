import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { ISalesParams, ISalesQuotationToSalesParams } from 'src/app/models/sales';

@Injectable({ providedIn: 'root'})
export class SalesService {
  private salesURL = 'api/sales';
  private getCdfToCustomerDropDownURL = 'api/cdf/getCdfTOCustomerDropDown';
  private   getItemDropDownURL  = 'api/item/getItemDropDown';

  constructor(private restService: RestService, private commonService: CommonService) {}

  public getSales(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.salesURL}${queryString}`);
  }
  public addSales(sales: ISalesParams) {
    return this.restService.post(`${this.salesURL}`, sales);
  }

  public editSales(sales: ISalesParams) {
    return this.restService.put(`${this.salesURL}`, sales);
  }
  public removeItems(id: string) {
    return this.restService.delete(`${this.salesURL}?id=${id}`);
  }

  public getCustomerDropDown() {
    return this.restService.get<any>(`${this.getCdfToCustomerDropDownURL}`);
  }
  public getItemDropDown() {
    return this.restService.get<any>(`${this.getItemDropDownURL}`);
  }
}
