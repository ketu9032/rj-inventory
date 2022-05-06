import { CommonService } from '../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';
import { IItemActiveParams, IItemParams } from 'src/app/models/item';
import { IItemSupplierParams } from 'src/app/models/item_supplier';

@Injectable({ providedIn: 'root' })
export class ItemsSuppliersService {
    private itemSupplierURL = 'api/item_supplier';

    private getSupplierDropDownUL = 'api/supplierDropDown';



    constructor(private restService: RestService, private commonService: CommonService) { }




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
    public getItemSupplierDropDown() {
        return this.restService.get<any>(`${this.getSupplierDropDownUL}`);
      }
}


