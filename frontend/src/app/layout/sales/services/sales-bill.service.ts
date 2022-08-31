import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { ISalesBillParams } from 'src/app/models/sales_bill';
@Injectable({ providedIn: 'root' })
export class SalesBillService {
    private salesBillURL = 'api/sales_bill';
    constructor(
        private restService: RestService,
        private commonService: CommonService
        ) { }
    public getItemsBySalesId(salesId: number) {
        return this.restService.get<any>(`${this.salesBillURL}?salesId=${salesId}`);
    }
    public addSalesBill(salesBill: ISalesBillParams) {
        return this.restService.post(`${this.salesBillURL}`, salesBill);
    }
    public editSalesBill(salesBill: ISalesBillParams) {
        return this.restService.put(`${this.salesBillURL}`, salesBill);
    }
    public removeSalesBill(id: string) {
        return this.restService.delete(`${this.salesBillURL}?id=${id}`);
    }
}
