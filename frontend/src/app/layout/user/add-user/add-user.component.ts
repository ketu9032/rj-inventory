import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUserData } from 'src/app/models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  formGroup: FormGroup;
  selectedRole: string
  roles = [
    { value: "Owner" },
    { value: "Employees" }
  ]


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IUserData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService

  ) { }

  ngOnInit() {
    this.initializeForm();
    if (this.data && this.data.id) {
      this.fillForm();
    }
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      openingBalance: ['', Validators.required],
      role: ['', Validators.required],
      permission: ['', Validators.required]
    });
  }

  saveUser(): void {
    const { userName, password: password, mobileNumber, openingBalance, role, permission } = this.formGroup.value;
    this.userService
      .addUser({
        userName,
        password,
        mobileNumber,
        openingBalance,
        role,
        permission
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User saved successfully', 'OK', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackBar.open(
            (error.error && error.error.message) || error.message,
            'Ok', {
            duration: 3000
          }
          );
        },
        () => { }
      );
  }

  updateUser(): void {
    const { userName, password: password, mobileNumber, openingBalance, role, permission } = this.formGroup.value;
    this.userService
      .editUser({
        id: this.data.id,
        userName,
        password,
        mobileNumber,
        openingBalance,
        role,
        permission
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User updated Successfully', 'OK', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        (error) => {
          this.snackBar.open(
            (error.error && error.error.message) || error.message,
            'Ok', {
            duration: 3000
          }
          );
        },
        () => { }
      );
  }

  onSubmit() {
    if (this.data && this.data.id) {
      this.updateUser();
    } else {
      this.saveUser();
    }
  }

  fillForm() {
    const { user_name: userName, password: password, mobile_number: mobileNumber, opening_balance: openingBalance, role: role, permission: permission } = this.data;
    this.formGroup.patchValue({
      userName,
      password,
      mobileNumber,
      openingBalance,
      role,
      permission
    });
  }
}
