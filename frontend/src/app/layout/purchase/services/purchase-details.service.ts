import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IPurchaseDetailsParams } from 'src/app/models/purchase-details';

@Injectable({ providedIn: 'root' })
export class PurchaseDetailsService {
    private purchaseDetailsURL = 'api/purchase_details';

    constructor(
        private restService: RestService,
        private commonService: CommonService
        ) { }

    public getPurchaseDetail(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.purchaseDetailsURL}${queryString}`);
    }
    public addPurchaseDetail(purchaseDetails: IPurchaseDetailsParams) {
        return this.restService.post(`${this.purchaseDetailsURL}`, purchaseDetails);
    }
    public editPurchaseDetail(purchaseDetails: IPurchaseDetailsParams) {
        return this.restService.put(`${this.purchaseDetailsURL}`, purchaseDetails);
    }
    public removePurchaseDetail(id: string) {
        return this.restService.delete(`${this.purchaseDetailsURL}?id=${id}`);
    }

}


