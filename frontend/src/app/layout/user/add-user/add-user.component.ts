import { AuthService } from './../../../auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
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
  selectedRole: string;
  roles = [{ value: 'Owner' }, { value: 'Employees' }];
  permissions = {
    dashboard: false,
    cdf: false,
    customers: false,
    items: false,
    sales: false,
    sales_quotation: false,
    suppliers: false,
    purchase: false,
    expense: false,
    transfer: false,
    analysis: false,
    roj_med: false,
    users: false,
    history: false
  };
  isLoggedInUserIsOwner = false;
  isShowLoader = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IUserData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const loggedInUser = this.authService.getUserData();
    this.isLoggedInUserIsOwner =
      loggedInUser.role.toLowerCase() === 'owner' ? true : false;
    this.initializeForm();
    if (this.data && this.data.id) {
      this.fillForm();
    }
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      userName: [
        {
          value: '',
          disabled:
            !this.isLoggedInUserIsOwner ||
            (this.data && this.data.id && this.isLoggedInUserIsOwner)
        },
        Validators.required
      ],
      password: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      balance: [
        {
          value: '',
          disabled:
            !this.isLoggedInUserIsOwner ||
            (this.data && this.data.id && this.isLoggedInUserIsOwner)
        }
      ],
      role: [
        {
          value: '',
          disabled:
            !this.isLoggedInUserIsOwner ||
            (this.data && this.data.id && this.isLoggedInUserIsOwner)
        },
        Validators.required
      ]
    });
  }

  saveUser(): void {
    const { userName, password, mobileNumber, balance, role } =
      this.formGroup.value;
    this.isShowLoader = true;
    this.userService
      .addUser({
        userName,
        password,
        mobileNumber,
        balance,
        role,
        permission: this.permissions
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User saved successfully', 'OK', {
            duration: 3000
          });
          this.isShowLoader = false;
          this.dialogRef.close(true);
        },
        (error) => {
          this.isShowLoader = false;
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

  updateUser(): void {
    const { userName, password, mobileNumber, balance, role } =
      this.formGroup.value;
    this.isShowLoader = true;
    this.userService
      .editUser({
        id: this.data.id,
        userName,
        password,
        mobileNumber,
        balance,
        role,
        permission: this.permissions
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User updated successfully', 'OK', {
            duration: 3000
          });
          this.isShowLoader = false;
          this.dialogRef.close(true);
        },
        (error) => {
          this.isShowLoader = false;
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

  onSubmit() {
    if (this.data && this.data.id) {
      this.updateUser();
    } else {
      this.saveUser();
    }
  }

  fillForm() {
    const {
      user_name: userName,
      password: password,
      mobile_number: mobileNumber,
      balance: balance,
      role: role,
      permission
    } = this.data;
    this.formGroup.patchValue({
      userName,
      password,
      mobileNumber,
      balance,
      role
    });
    this.permissions ={ ...this.permissions,...permission as any};
  }

  onPermissionChange(key: string) {
    if (this.isLoggedInUserIsOwner) {
      this.permissions[key] = !this.permissions[key];
    }
  }
}
