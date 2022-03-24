import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IExpenseParams } from 'src/app/models/expense';

@Injectable({ providedIn: 'root'})
export class ExpenseService {
  private url = 'api/transfers';

  constructor(private restService: RestService, private commonService: CommonService) {}

  public getExpense(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addExpense(customers: IExpenseParams) {
    return this.restService.post(`${this.url}`, customers);
  }
  public editExpense(customers: IExpenseParams) {
    return this.restService.put(`${this.url}`, customers);
  }
  public removeExpense(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
}
