import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { IUser } from 'src/app/models/user';
import { RestService } from '../shared/services';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject: BehaviorSubject<IUser>;
  public user: Observable<IUser>;
  private url = 'api/users';
  constructor(
    private router: Router,
    private http: HttpClient,
    private restService: RestService
  ) {
    this.userSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('user'))
    );
    this.user = this.userSubject.asObservable();
  }

  login(user: IUser): Observable<any> {
    return this.restService.post(`${this.url}/login`, user);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  public get userValue(): IUser {
    return this.userSubject.value;
  }
  getUserData() {
    return JSON.parse(window.localStorage.getItem('user'));
  }

}
