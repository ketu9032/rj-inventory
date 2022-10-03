import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
@Injectable({ providedIn: 'root'})
export class RojMedService {

    getRojMedURL = 'api/roj_med';
    getSalesByUserIdURL = 'api/sales/getSalesByUserIdInRojMed';
    getExpenseByUserIdURL = 'api/expense/getSalesByUserIdInRojMed';
    getTransferByUserIdURL = 'api/transfers/getTransferByUserIdInRojMed';
    getReceiveByUserIdURL = 'api/transfers/getReceiveByUserIdInRojMed';
    getPurchaseByUserIdURL = 'api/purchase/getPurchaseByUserIdInRojMed';

  constructor(private restService: RestService, private commonService: CommonService) {}
  getRojMedData(date) {
    return this.restService.get<any>(`${this.getRojMedURL}?date=${date}`);
  }
  getSalesByUserId(userId: number) {
    return this.restService.get<any>(`${this.getSalesByUserIdURL}?userId=${userId}`);
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
