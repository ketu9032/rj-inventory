import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IItemActiveParams, IItemParams } from 'src/app/models/item';

@Injectable({ providedIn: 'root'})
export class ItemsService {
  private url = 'api/item';
  private changeStatusURL = 'api/item/changeStatus';

  constructor(private restService: RestService, private commonService: CommonService) {}

  public getItems(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addItems(item: IItemParams) {
    return this.restService.post(`${this.url}`, item);
  }
  public editItems(item: IItemParams) {
    return this.restService.put(`${this.url}`, item);
  }
  public removeItems(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
  public changeStatus(item: IItemActiveParams) {
    return this.restService.put(`${this.changeStatusURL}`, item);
}
}


