import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IItemActiveParams, IItemParams } from 'src/app/models/item';
import { IItemSupplierParams } from 'src/app/models/item_supplier';

@Injectable({ providedIn: 'root' })
export class ItemsService {
    private itemURL = 'api/item';
    private changeStatusURL = 'api/item/changeStatus';
    private itemSupplierURL = 'api/item_supplier';
    private getSupplierDropDownURL = 'api/getCategoryDropDown';



    constructor(private restService: RestService, private commonService: CommonService) { }

    public getItems(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.itemURL}${queryString}`);
    }
    public addItems(item: IItemParams) {
        return this.restService.post(`${this.itemURL}`, item);
    }
    public editItems(item: IItemParams) {
        return this.restService.put(`${this.itemURL}`, item);
    }
    public removeItems(id: string) {
        return this.restService.delete(`${this.itemURL}?id=${id}`);
    }
    public changeStatus(item: IItemActiveParams) {
        return this.restService.put(`${this.changeStatusURL}`, item);
    }


    public getItemSupplier(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.itemSupplierURL}${queryString}`);
    }
    public addItemSupplier(itemSupplier: IItemSupplierParams) {
        return this.restService.post(`${this.itemSupplierURL}`, itemSupplier);
    }
    public editItemSupplier(itemSupplier: IItemSupplierParams) {
        return this.restService.put(`${this.itemSupplierURL}`, itemSupplier);
    }
    public removeItemSupplier(id: string) {
        return this.restService.delete(`${this.itemSupplierURL}?id=${id}`);
    }
    public getSupplierDropDown() {
        return this.restService.get<any>(`${this.getSupplierDropDownURL}`);
      }
}


