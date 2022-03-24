import { CommonService } from './../../../shared/services/common.service';
import { ICategoriesActiveParams, ICategoriesParams } from './../../../models/categories';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
    private getTierDropDownURL = 'api/getCategoryDropDown';
    private url = 'api/categories';
    private categoriesChangeStatusURL = 'api/categories/changeStatus';


    constructor(private restService: RestService, private commonService: CommonService) { }

    public getCategoryDropDown() {
        return this.restService.get<any>(`${this.getTierDropDownURL}`);
    }

    public getCategory(tablePrams: IMatTableParams) {
        const queryString = this.commonService.toQueryString(tablePrams);
        return this.restService.get<any>(`${this.url}${queryString}`);
    }
    public addCategory(category: ICategoriesParams) {
        return this.restService.post(`${this.url}`, category);
    }
    public editCategory(category: ICategoriesParams) {
        return this.restService.put(`${this.url}`, category);
    }
    public removeCategory(id: string) {
        return this.restService.delete(`${this.url}?id=${id}`);
    }
    public changeStatus(category: ICategoriesActiveParams) {
        return this.restService.put(`${this.categoriesChangeStatusURL}`, category);
    }
}
