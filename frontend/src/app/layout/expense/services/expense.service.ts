import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IExpenseActiveParams, IExpenseParams } from 'src/app/models/expense';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
    private url = 'api/expense';
    private changeStatusURL = 'api/expense/changeStatus';
    private approvedURL = 'api/expense/approved';


    constructor(private restService: RestService, private commonService: CommonService) { }

    public getExpense(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.url}${queryString}`);
    }
    public addExpense(expense: IExpenseParams) {
        return this.restService.post(`${this.url}`, expense);
    }
    public editExpense(expense: IExpenseParams) {
        return this.restService.put(`${this.url}`, expense);
    }
    public removeExpense(id: string) {
        return this.restService.delete(`${this.url}?id=${id}`);
    }

    public changeStatus(transfer: IExpenseActiveParams) {
        return this.restService.put(`${this.changeStatusURL}`, transfer);
    }
    public approved(expenseId: number) {
        return this.restService.put(`${this.approvedURL}`, {expenseId});
      }

}
