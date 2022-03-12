import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { ITransferParams } from 'src/app/models/transfer';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class TransferService {
  private url = 'api/transfers';


  constructor(private restService: RestService, private commonService: CommonService) {}

  public getTransfer(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
  }
  public addTransfer(transfer: ITransferParams) {
    return this.restService.post(`${this.url}`, transfer);
  }
  public editTransfer(transfer: ITransferParams) {
    return this.restService.put(`${this.url}`, transfer);
  }
  public removeTransfer(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }


}

