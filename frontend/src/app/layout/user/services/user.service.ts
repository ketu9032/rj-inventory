import { CommonService } from './../../../shared/services/common.service';
import { Injectable } from '@angular/core';
import { IMatTableParams } from 'src/app/models/table';
import { IUserActiveParams, IUserName, IUserParams } from 'src/app/models/user';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = 'api/users';
  private getUserDropDownURL = 'api/getUserDropDown';
  private changeStatusURL = 'api/users/changeStatus';
  private onCheckUserNameURL = 'api/users/onCheckUserName';

  constructor(
    private restService: RestService,
    private commonService: CommonService
  ) {}

  public getUser(tablePrams: IMatTableParams) {
    const queryString = this.commonService.toQueryString(tablePrams);
    return this.restService.get<any>(`${this.url}${queryString}`);
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
  public getUserDropDown(loggedInUser: boolean) {
    return this.restService.get<any>(`${this.getUserDropDownURL}?loggedInUser=${loggedInUser}`);
  }
  public changeStatus(user: IUserActiveParams) {
    return this.restService.put(`${this.changeStatusURL}`, user);
  }

  public onCheckUserName(userName: IUserName) {
    return this.restService.put(`${this.onCheckUserNameURL}`, userName);
}
}
