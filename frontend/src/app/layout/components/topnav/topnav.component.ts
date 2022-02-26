import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
  public pushRightClass: string;
  user: any;

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
    public authService: AuthService
  ) {
    this.router.events.subscribe((val) => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';
    this.user = this.authService.getUserData();
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  onLoggedout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

  getChangePassword(): void {
    this.dialog
      .open(ChangePasswordComponent, {})
      .afterClosed()
      .subscribe((result) => {});
  }
}
