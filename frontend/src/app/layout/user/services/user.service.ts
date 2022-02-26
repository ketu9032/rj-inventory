import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services';

@Injectable({ providedIn: 'root'})
export class UserService {
  private url = 'api/users';

  constructor(private restService: RestService) {}

  public getUser() {
    return this.restService.get<any>(`${this.url}`);
  }
  public addUser(users) {
    return this.restService.post(`${this.url}`, users);
  }
  public editUser(users) {
    return this.restService.put(`${this.url}`, users);
  }
  public removeUser(id: string) {
    return this.restService.delete(`${this.url}?id=${id}`);
  }
}
