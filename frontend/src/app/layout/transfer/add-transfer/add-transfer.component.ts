import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ITransferData } from 'src/app/models/transfer';
import { IUserData } from 'src/app/models/user';
import { TransferService } from '../services/transfer.service';

@Component({
  selector: 'app-add-transfer',
  templateUrl: './add-transfer.component.html',
  styleUrls: ['./add-transfer.component.scss']
})
export class AddTransferComponent implements OnInit {
  formGroup: FormGroup;
  selectedRole: string
  roles = [
    { value: "Owner" },
    { value: "Employees" }
  ]


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITransferData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTransferComponent>,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private transferService: TransferService

  ) { }

  ngOnInit() {
    this.initializeForm();
    if (this.data && this.data.id) {
      this.fillForm();
    }
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }

  saveTransfer(): void {
    const { userId, description, amount, date } = this.formGroup.value;
    this.transferService
      .addTransfer({
        userId, description, amount, date
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

  // updateTransfer(): void {
  //   const { userId, description, amount, date } = this.formGroup.value;
  //   this.transferService
  //     .editTransfer({
  //       id: this.data.id,
  //       userId,
  //       description, amount,
  //     })
  //     .subscribe(
  //       (response) => {
  //         this.snackBar.open('User updated Successfully', 'OK', {
  //           duration: 3000
  //         });
  //         this.dialogRef.close(true);
  //       },
  //       (error) => {
  //         this.snackBar.open(
  //           (error.error && error.error.message) || error.message,
  //           'Ok', {
  //           duration: 3000
  //         }
  //         );
  //       },
  //       () => { }
  //     );
  // }

  onSubmit() {
    if (this.data && this.data.id) {
  //    this.updateTransfer();
    } else {
      this.saveTransfer();
    }
  }

  fillForm() {
    const { userId: userId, description: description, amount: amount, date: date } = this.data;
    this.formGroup.patchValue({
      description,
      amount,
      userId,
      date
    });
  }
}
