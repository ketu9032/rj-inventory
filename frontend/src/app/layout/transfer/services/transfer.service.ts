import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams, IMatTableParamsWithSearchParams } from 'src/app/models/table';
import { ITransferActiveParams, ITransferParams } from 'src/app/models/transfer';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class TransferService {
  private url = 'api/transfers';
  private changeStatusURL = 'api/transfers/changeStatus';
  private approvedURL = 'api/transfers/approved';


  constructor(private restService: RestService, private commonService: CommonService) {}

  public getTransfer(tablePrams: IMatTableParamsWithSearchParams) {
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
  public changeStatus(transfer: ITransferActiveParams) {
    return this.restService.put(`${this.changeStatusURL}`, transfer);
  }
  public approved(transferId: number) {
    return this.restService.put(`${this.approvedURL}`, {transferId});
  }
}

