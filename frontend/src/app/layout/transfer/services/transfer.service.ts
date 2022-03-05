import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { ITransferParams } from 'src/app/models/transfer';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class TransferService {
  private url = 'api/transfers';

  constructor(private restService: RestService) {}

  public getTransfer(tablePrams: IMatTableParams) {
    return this.restService.get<any>(`${this.url}?orderBy=${tablePrams.orderBy}&direction=${tablePrams.direction}&pageSize=${tablePrams.pageSize}&pageNumber=${tablePrams.pageNumber}&search=${tablePrams.search}`);
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

