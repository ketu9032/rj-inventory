import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { ICdfParams } from 'src/app/models/cdf';

@Injectable({ providedIn: 'root'})
export class CDFService {
  private url = 'api/customers';

  constructor(private restService: RestService, private commonService: CommonService) {}

  public getCdf(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addCdf(cdf: ICdfParams) {
    return this.restService.post(`${this.url}`, cdf);
  }
  public editCdf(cdf: ICdfParams) {
    return this.restService.put(`${this.url}`, cdf);
  }
  public removeCdf(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
}
