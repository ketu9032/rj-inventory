import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
import { saleRojMedParams } from 'src/app/models/rojmed';
@Injectable({ providedIn: 'root' })
export class RojMedService {

    getRojMedURL = 'api/roj_med';
    getSalesByUserIdURL = 'api/sales/getSalesByUserIdInRojMed';
    getExpenseByUserIdURL = 'api/expense/getSalesByUserIdInRojMed';
    getTransferByUserIdURL = 'api/transfers/getTransferByUserIdInRojMed';
    getReceiveByUserIdURL = 'api/transfers/getReceiveByUserIdInRojMed';
    getPurchaseByUserIdURL = 'api/purchase/getPurchaseByUserIdInRojMed';

    constructor(private restService: RestService, private commonService: CommonService) { }

    getRojMedData(date) {
        return this.restService.get<any>(`${this.getRojMedURL}?date=${date}`);
    }
    getSalesByUserId(saleRojMedData: saleRojMedParams) {
        const queryString = this.commonService.toQueryString(saleRojMedData);
        return this.restService.get<any>(`${this.getSalesByUserIdURL}${queryString}`)
    }
    getExpenseByUserId(userId: number) {
        return this.restService.get<any>(`${this.getExpenseByUserIdURL}?userId=${userId}`);
    }
    getTransferByUserId(userId: number) {
        return this.restService.get<any>(`${this.getTransferByUserIdURL}?userId=${userId}`);
    }
    getReceiveByUserId(userId: number) {
        return this.restService.get<any>(`${this.getReceiveByUserIdURL}?userId=${userId}`);
    }
    getPurchaseByUserId(userId: number) {
        return this.restService.get<any>(`${this.getPurchaseByUserIdURL}?userId=${userId}`);
    }
}
