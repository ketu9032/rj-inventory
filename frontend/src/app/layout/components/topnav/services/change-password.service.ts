import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';

@Injectable()
export class ChangePasswordService {
  private url = 'api/users/change-password';

  constructor(private restService: RestService) {}

  public changePassword(id: string, newPassword: string, oldPassword: string) {
    return this.restService.put<any>(`${this.url}`, {
      id: id,
      new_password: newPassword,
      old_password: oldPassword
    });
  }
}
