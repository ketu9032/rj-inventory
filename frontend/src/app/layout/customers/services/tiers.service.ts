import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { ITiersParams } from 'src/app/models/tiers';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class TiersService {
  private getTierDropDownURL = 'api/getTierDropDown';
  private url = 'api/tiers';

  constructor(private restService: RestService, private commonService: CommonService) { }

  public getTierDropDown() {
    return this.restService.get<any>(`${this.getTierDropDownURL}`);
  }

  public getTiers(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addTiers(tier: ITiersParams) {
    return this.restService.post(`${this.url}`, tier);
  }
  public editTiers(tier: ITiersParams) {
    return this.restService.put(`${this.url}`, tier);
  }
  public removeTiers(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
}
