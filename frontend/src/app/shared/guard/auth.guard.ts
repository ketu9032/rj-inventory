import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RestService } from '../services/rest.service';

@Injectable()
export class AuthGuard implements CanActivate {
  user: any;

  constructor(private router: Router, private restService: RestService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.user = this.restService.getUserData();
    if (state.url === '/dashboard') {
      if (this.user && this.user.permission && this.user.permission.dashboard) {
        return true;
      } else {
        this.navigateToLoginPage();
        return false;
      }
    } else if (state.url === '/user') {
        if (this.user && this.user.permission && this.user.permission.users) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/cdf') {
        if (this.user && this.user.permission && this.user.permission.cdf) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/customers') {
        if (this.user && this.user.permission && this.user.permission.customers) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/items') {
        if (this.user && this.user.permission && this.user.permission.items) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/sales') {
        if (this.user && this.user.permission && this.user.permission.sales) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/salesQuotation') {
        if (this.user && this.user.permission && this.user.permission.sales_quotation) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/suppliers') {
        if (this.user && this.user.permission && this.user.permission.suppliers) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/purchaseQuotation') {
        if (this.user && this.user.permission && this.user.permission.purchase_quotation) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/purchase') {
        if (this.user && this.user.permission && this.user.permission.purchase) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/expense') {
        if (this.user && this.user.permission && this.user.permission.expense) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/transfer') {
        if (this.user && this.user.permission && this.user.permission.transfer) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/analysis') {
        if (this.user && this.user.permission && this.user.permission.analysis) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/rojMed') {
        if (this.user && this.user.permission && this.user.permission.roj_med) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/history') {
        if (this.user && this.user.permission && this.user.permission.history) {
          return true;
        } else {
          this.navigateToLoginPage();
          return false;
        }
      }
      else if (state.url === '/login') {
        return false;
      }
      else {
        this.navigateToLoginPage();
        return false;
      }
  }

  navigateToLoginPage() {
    this.router.navigate(['/login']);
  }
}
