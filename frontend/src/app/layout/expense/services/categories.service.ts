import { CommonService } from './../../../shared/services/common.service';
import { ICategoriesParams } from './../../../models/categories';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private getTierDropDownURL = 'api/getCategoryDropDown';
  private url = 'api/categories';

  constructor(private restService: RestService, private commonService: CommonService) {}

  public getCategoryDropDown() {
    return this.restService.get<any>(`${this.getTierDropDownURL}`);
  }

  public getCategory(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addCategory(tier: ICategoriesParams) {
    return this.restService.post(`${this.url}`, tier);
  }
  public editCategory(tier: ICategoriesParams) {
    return this.restService.put(`${this.url}`, tier);
  }
  public removeCategory(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
}
