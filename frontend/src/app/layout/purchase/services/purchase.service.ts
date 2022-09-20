import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IPurchaseActiveParams, IPurchaseParams } from 'src/app/models/purchase';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
    private url = 'api/purchase';
    private supplierUrl = 'api/supplierDropDown'
    private purchaseChangeStatusURl = 'api/purchase/changeStatus'
    private getItemDropDownURL = 'api/item/getItemDropDown';
    private isSupplierIdInPurchaseURL = 'api/sales/isSupplierIdInPurchase';
    private getPurchaseByIdURL = 'api/purchase/getPurchaseById'
    private getSupplierByIdURL = 'api/suppliers/getSuppliersById';
    private getPurchasePrintURL= 'api/purchase/purchasePrint';

    constructor(private restService: RestService, private commonService: CommonService) { }

    public getPurchase(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.url}${queryString}`);
    }
    public addPurchase(purchase: IPurchaseParams) {
        return this.restService.post(`${this.url}`, purchase);
    }
    public editPurchase(purchase: IPurchaseParams) {
        return this.restService.put(`${this.url}`, purchase);
    }
    public removePurchase(id: string) {
        return this.restService.delete(`${this.url}?id=${id}`);
    }
    public changeStatus(purchase: IPurchaseActiveParams) {
        return this.restService.put(`${this.purchaseChangeStatusURl}`, purchase);
    }
    public getSupplierDropDown() {
        return this.restService.get(`${this.supplierUrl}`);
    }
    public getItemDropDown() {
        return this.restService.get<any>(`${this.getItemDropDownURL}`);
    }

    public getPurchaseById(purchaseId: number) {
        return this.restService.get<any>(`${this.getPurchaseByIdURL}?purchaseId=${purchaseId}`);
    }

    public isSupplierIdInPurchase(supplierID: number) {
        return this.restService.get<any>(`${this.isSupplierIdInPurchaseURL}?supplierID=${supplierID}`);
    }
    public getSupplierById(supplierId: number) {
        return this.restService.get<any>(`${this.getSupplierByIdURL}?supplierId=${supplierId}`);
    }

    public purchasePrint(purchaseId: number) {
        return this.restService.get<any>(`${this.getPurchasePrintURL}?purchaseId=${purchaseId}`);
         }
}
