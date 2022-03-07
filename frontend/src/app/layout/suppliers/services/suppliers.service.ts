import { Injectable } from '@angular/core';
import { ISuppliersParams } from 'src/app/models/suppliers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class SuppliersService {
  private url = 'api/suppliers';

  constructor(private restService: RestService) {}

  public getSuppliers(tablePrams: IMatTableParams) {
    return this.restService.get<any>(`${this.url}?orderBy=${tablePrams.orderBy}&direction=${tablePrams.direction}&pageSize=${tablePrams.pageSize}&pageNumber=${tablePrams.pageNumber}&search=${tablePrams.search}&active=${tablePrams.active}`);
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


}
