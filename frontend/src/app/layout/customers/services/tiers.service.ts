import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { ITiersParams } from 'src/app/models/tiers';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class TiersService {
  private getTierDropDownURL = 'api/getTierDropDown';
  private tierURL = 'api/tiers';

  constructor(private restService: RestService) { }

  public getTierDropDown() {
    return this.restService.get<any>(`${this.getTierDropDownURL}`);
  }

  public getTiers(tablePrams: IMatTableParams) {
    return this.restService.get<any>(`${this.tierURL}?orderBy=${tablePrams.orderBy}&direction=${tablePrams.direction}&pageSize=${tablePrams.pageSize}&pageNumber=${tablePrams.pageNumber}&search=${tablePrams.search}`);
  }
  public addTiers(tier: ITiersParams) {
    return this.restService.post(`${this.tierURL}`, tier);
  }
  public editTiers(tier: ITiersParams) {
    return this.restService.put(`${this.tierURL}`, tier);
  }
  public removeTiers(id: string) {
    return this.restService.delete(`${this.tierURL}?id=${id}`);
  }
}
