import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RestService } from '../services/rest.service';

@Injectable()
export class AuthGuard implements CanActivate {
    user: any;

    constructor(private router: Router, private restService: RestService) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {


        this.user = this.restService.getUserData();

        if (localStorage.getItem('user')) {
            return true;
        }else{
            this.router.navigate(['/login']);
        }
         if( state.url  === this.user.permission.dashboard){
            return true;
        }else{
            this.router.navigate(['/login']);
        }
         if( state.url  === this.user.permission.user){
            return true;
        }else{
            this.router.navigate(['/login']);
        }
         if( state.url  === this.user.permission.cdf){
            return true;
        }else{
            this.router.navigate(['/login']);
        }
         if( state.url  === this.user.permission.customers){
            return true;
        }else{
            this.router.navigate(['/login']);
        }

        return false;

    }
}
