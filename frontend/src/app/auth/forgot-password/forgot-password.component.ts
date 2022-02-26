import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(public snackBar: MatSnackBar) {}

  ngOnInit() {}

  onForgotPassword() {
    this.snackBar.open('Success', 'Save', {
      duration: 3000
    });
  }
}
