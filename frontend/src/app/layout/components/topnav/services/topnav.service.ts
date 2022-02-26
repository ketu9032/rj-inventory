import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';

@Injectable()
export class TopNavService {
  private url = 'api/transfer';
  loading = true;

  constructor(private restService: RestService) {}

  public getTransfers() {
    return this.restService.get<any>(`${this.url}`);
  }

  public addTransfer(transfer) {
    return this.restService.post(`${this.url}`, transfer);
  }

  public editTransfer(transfer) {
    return this.restService.put(`${this.url}`, transfer);
  }

  public removeTransfer(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }

  public getUsersNames() {
    return this.restService.getUsername<any>(`${this.url}`);
  }
}
