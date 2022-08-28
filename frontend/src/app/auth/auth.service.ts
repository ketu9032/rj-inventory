import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { RestService } from '../shared/services';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private url = 'api/users';
    constructor(
        private router: Router,
        private restService: RestService
    ) {

    }

    login(user: { userName: string, password: string }): Observable<any> {
        return this.restService.post(`${this.url}/login`, user);
    }

    logout() {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    }

    getUserData() {
        return JSON.parse(window.localStorage.getItem('user'));
    }
}
