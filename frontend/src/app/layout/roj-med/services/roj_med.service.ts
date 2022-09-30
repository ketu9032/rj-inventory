import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';
@Injectable({ providedIn: 'root'})
export class RojMedService {
    getRojMedURL = 'api/roj_med';
    getSalesByUserIdURL = 'api/sales/getSalesByUserIdInRojMed';
  constructor(private restService: RestService, private commonService: CommonService) {}
  getRojMedData(date) {
    return this.restService.get<any>(`${this.getRojMedURL}?date=${date}`);
  }
  getSalesByUserId(userId: number) {
    return this.restService.get<any>(`${this.getSalesByUserIdURL}?userId=${userId}`);
  }
}
