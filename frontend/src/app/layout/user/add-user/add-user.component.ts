import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initializeForm();
    if (this.data && this.data._id) {
      this.fillForm();
    }
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  saveUser(): void {
    this.userService
      .addUser({
        password: this.formGroup.value.password,
        email: this.formGroup.value.email,
        userName: this.formGroup.value.user_name,
        firstName: this.formGroup.value.first_name,
        lastName: this.formGroup.value.last_name,
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User saved successfully', 'OK', {
            duration: 3000
          });
          this.dialog.closeAll();
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
    this.userService
      .editUser({
        id: this.data._id,
        password: this.formGroup.value.password,
        email: this.formGroup.value.email,
        userName: this.formGroup.value.user_name,
        firstName: this.formGroup.value.first_name,
        lastName: this.formGroup.value.last_name,
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User updated Successfully', 'OK', {
            duration: 3000
          });
          this.dialog.closeAll();
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
    if (this.data && this.data._id) {
      this.updateUser();
    } else {
      this.saveUser();
    }
  }

  fillForm() {
    this.formGroup.patchValue({
      first_name: this.data.first_name,
      last_name: this.data.last_name,
      user_name: this.data.user_name,
      email: this.data.email,
      password: this.data.password
    });
  }
}
