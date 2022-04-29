import { Injectable } from '@angular/core';
import { ICustomersActiveParams, ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { CommonService } from 'src/app/shared/services/common.service';

@Injectable({ providedIn: 'root'})
export class CustomersService {
  private url = 'api/customers';
  private activeCustomers = 'api/cdf/findAllCdfActive';
  private customersChangeStatusURl = 'api/customers/changeStatus';


  constructor(private restService: RestService, private commonService: CommonService) {}

  public getCustomers(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addCustomers(customers: ICustomersParams) {
    return this.restService.post(`${this.url}`, customers);
  }
  public editCustomers(customers: ICustomersParams) {
    return this.restService.put(`${this.url}`, customers);
  }
  public removeCustomers(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
  public changeStatus(customers: ICustomersActiveParams) {
    return this.restService.put(`${this.customersChangeStatusURl}`, customers);
  }

  public getCdfActiveCustomers(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.activeCustomers}${queryString}`);
  }

}
