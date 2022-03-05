import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { IUserParams } from 'src/app/models/user';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class UserService {
  private url = 'api/users';
  private getUserDropDownURL = 'api/getUserDropDown';

  constructor(private restService: RestService) {}

  public getUser(tablePrams: IMatTableParams) {
    return this.restService.get<any>(`${this.url}?orderBy=${tablePrams.orderBy}&direction=${tablePrams.direction}&pageSize=${tablePrams.pageSize}&pageNumber=${tablePrams.pageNumber}&search=${tablePrams.search}&active=${tablePrams.active}`);
  }
  public addUser(user: IUserParams) {
    return this.restService.post(`${this.url}`, user);
  }
  public editUser(user: IUserParams) {
    return this.restService.put(`${this.url}`, user);
  }
  public removeUser(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
  public getUserDropDown() {
    return this.restService.get<any>(`${this.getUserDropDownURL}`);
  }

}
