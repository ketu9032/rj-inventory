import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IPurchaseParams } from 'src/app/models/purchase';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
    private url = 'api/purchase';
    private SupplierUrl = 'api/supplierDropDown'

    constructor(private restService: RestService, private commonService: CommonService) { }

    public getPurchase(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.url}${queryString}`);
    }
    public addPurchase(purchase: IPurchaseParams) {
        return this.restService.post(`${this.url}`, purchase);
    }
    public editPurchases(purchase: IPurchaseParams) {
        return this.restService.put(`${this.url}`, purchase);
    }
    public removePurchase(id: string) {
        return this.restService.delete(`${this.url}?id=${id}`);
    }
    public getSupplierDropDown() {
        return this.restService.get(`${this.SupplierUrl}`);
    }
}
