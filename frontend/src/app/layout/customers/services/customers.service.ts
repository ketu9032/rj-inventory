import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class CustomersService {
  private url = 'api/customers';

  constructor(private restService: RestService) {}

  public getCustomers(tablePrams: IMatTableParams) {
    return this.restService.get<any>(`${this.url}?orderBy=${tablePrams.orderBy}&direction=${tablePrams.direction}&pageSize=${tablePrams.pageSize}&pageNumber=${tablePrams.pageNumber}&search=${tablePrams.search}`);
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
}
