import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class ItemsService {
  private url = 'api/customers';

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
}
