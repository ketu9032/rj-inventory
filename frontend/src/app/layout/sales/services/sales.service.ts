import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class SalesService {
  private url = 'api/customers';
  private getCdfToCustomerDropDownURL = 'api/cdf/getCdfTOCustomerDropDown';
  private   getItemDropDownURL  = 'api/item/getItemDropDown';

  constructor(private restService: RestService, private commonService: CommonService) {}

  public getItems(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addItems(customers: ICustomersParams) {
    return this.restService.post(`${this.url}`, customers);
  }
  public editItems(customers: ICustomersParams) {
    return this.restService.put(`${this.url}`, customers);
  }
  public removeItems(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }

  public getCustomerDropDown() {
    return this.restService.get<any>(`${this.getCdfToCustomerDropDownURL}`);
  }
  public getItemDropDown() {
    return this.restService.get<any>(`${this.getItemDropDownURL}`);
  }
}
