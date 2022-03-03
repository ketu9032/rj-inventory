import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  selectedRole: string
  roles = [
    { value: "Owner" },
    { value: "Employees" }
  ]


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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
      username: ['', Validators.required],
      password: ['', Validators.required],
      mobilenumber: ['', Validators.required],
      openingbalance: ['', Validators.required],
      role: ['', Validators.required],
      permission: ['', Validators.required]
    });
  }

  saveUser(): void {

    this.userService
      .addUser({
        username: this.formGroup.value.username,
        password: this.formGroup.value.password,
        mobilenumber: this.formGroup.value.mobilenumber,
        openingbalance: this.formGroup.value.openingbalance,
        role: this.formGroup.value.role,
        permission: this.formGroup.value.permission
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
    this.userService
      .editUser({
        id: this.data.id,
        username: this.formGroup.value.username,
        password: this.formGroup.value.password,
        mobilenumber: this.formGroup.value.mobilenumber,
        openingbalance: this.formGroup.value.openingbalance,
        role: this.formGroup.value.role,
        permission: this.formGroup.value.permission
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
    this.formGroup.patchValue({
      username: this.data.username,
      password: this.data.password,
      mobilenumber: this.data.mobilenumber,
      openingbalance: this.data.openingbalance,
      role: this.data.role,
      permission: this.data.permission
    });
  }
}
