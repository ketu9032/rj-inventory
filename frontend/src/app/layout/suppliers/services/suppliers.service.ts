import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { ISuppliersActiveParams, ISuppliersParams } from 'src/app/models/suppliers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class SuppliersService {
  private url = 'api/suppliers';
  private suppliersChangeStatusURL = 'api/suppliers/changeStatus';

  constructor(private restService: RestService, private commonService: CommonService) {}

  public getSuppliers(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addSuppliers(suppliers: ISuppliersParams) {
    return this.restService.post(`${this.url}`, suppliers);
  }
  public editSuppliers(suppliers: ISuppliersParams) {
    return this.restService.put(`${this.url}`, suppliers);
  }
  public removeSuppliers(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
  public changeStatus(suppliers: ISuppliersActiveParams) {
    return this.restService.put(`${this.suppliersChangeStatusURL}`, suppliers);
  }

}
