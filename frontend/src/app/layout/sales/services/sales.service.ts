import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { ICdfUpdateParams, ISalesActiveParams, ISalesParams, ISalesQuotationToSalesParams } from 'src/app/models/sales';

@Injectable({ providedIn: 'root'})
export class SalesService {
  private salesURL = 'api/sales';
  private getSalesByIdURL = 'api/sales/getSalesById';
  private getCdfToCustomerDropDownURL = 'api/cdf/getCdfTOCustomerDropDown';
  private   getItemDropDownURL  = 'api/item/getItemDropDown';
  private salesChangeStatusURl = 'api/sales/changeStatus';
  private updateValueURL = 'api/sales/updateValue';
  private isCustomerIdInSalesURL = 'api/sales/isCustomerIdInSales';
  private getCustomerByIdURL = 'api/cdf/getCustomerById';
  private getSalesPrintURL= 'api/sales/salesPrint';

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
  public changeStatus(sales: ISalesActiveParams) {
    return this.restService.put(`${this.salesChangeStatusURl}`, sales);
}
public getCustomerDropDown() {
    return this.restService.get<any>(`${this.getCdfToCustomerDropDownURL}`);
}
public getItemDropDown() {
    return this.restService.get<any>(`${this.getItemDropDownURL}`);
}
public getSalesById(salesId: number) {
    return this.restService.get<any>(`${this.getSalesByIdURL}?salesId=${salesId}`);
}

public updateValue(sales: ICdfUpdateParams) {
    return this.restService.put(`${this.updateValueURL}`,sales);
}
public isCustomerIdInSales(customerID: number) {
    return this.restService.get<any>(`${this.isCustomerIdInSalesURL}?customerID=${customerID}`);
}
public getCustomerById(customerId: number) {
    return this.restService.get<any>(`${this.getCustomerByIdURL}?customerId=${customerId}`);
    }

    public salesPrint(salesId: number) {
   return this.restService.get<any>(`${this.getSalesPrintURL}?salesId=${salesId}`);
    }
}
