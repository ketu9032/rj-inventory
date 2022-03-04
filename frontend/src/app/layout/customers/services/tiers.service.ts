import { Injectable } from '@angular/core';
import { ICustomersParams } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class TiersService {
  private getTierDropDownURL = 'api/getTierDropDown';

  constructor(private restService: RestService) {}

  public getTierDropDown() {
    return this.restService.get<any>(`${this.getTierDropDownURL}`);
  }
 
}
