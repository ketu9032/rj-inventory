import { ICategoriesParams } from './../../../models/categories';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private getTierDropDownURL = 'api/getCategoryDropDown';
  private tierURL = 'api/categories';

  constructor(private restService: RestService) {}

  public getCategoryDropDown() {
    return this.restService.get<any>(`${this.getTierDropDownURL}`);
  }

  public getCategory(tablePrams: IMatTableParams) {
    return this.restService.get<any>(
      `${this.tierURL}?orderBy=${tablePrams.orderBy}&direction=${tablePrams.direction}&pageSize=${tablePrams.pageSize}&pageNumber=${tablePrams.pageNumber}&search=${tablePrams.search}`
    );
  }
  public addCategory(tier: ICategoriesParams) {
    return this.restService.post(`${this.tierURL}`, tier);
  }
  public editCategory(tier: ICategoriesParams) {
    return this.restService.put(`${this.tierURL}`, tier);
  }
  public removeCategory(id: string) {
    return this.restService.delete(`${this.tierURL}?id=${id}`);
  }
}
