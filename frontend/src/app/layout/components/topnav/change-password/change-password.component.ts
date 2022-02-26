import { AuthService } from './../../../../auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangePasswordService } from '../services/change-password.service';
import { ConfirmedValidator } from './confirmed.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private changePasswordService: ChangePasswordService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    const userId = this.authService.getUserData()[0].id;
    this.changePasswordService
      .changePassword(
        userId,
        this.formGroup.controls.newPassword.value,
        this.formGroup.controls.oldPassword.value
      )
      .subscribe(
        (response) => {
          this.snackBar.open('Password change successfully', 'OK',{
            duration: 3000
          });
          this.dialog.closeAll();
        },
        (error) => {
          this.snackBar.open(
            (error.error && error.error.message) || error.message,
            'Ok',
            {
              duration: 3000
            }
          );
        },
        () => {}
      );
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required]
      },
      {
        validator: ConfirmedValidator('newPassword', 'confirmNewPassword')
      }
    );
  }
}
