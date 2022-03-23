import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ITransferData } from 'src/app/models/transfer';
import { IUserData } from 'src/app/models/user';
import { UserService } from '../../user/services/user.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {
  formGroup: FormGroup;
  selectedRole: string;
  users = [];
  myDate: string
//   date = new FormControl(new Date());
//   serializedDate = new FormControl(new Date().toISOString());


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ITransferData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddExpenseComponent>,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private datePipe: DatePipe
  ) {  }
  ngOnInit() {
      this.initializeForm();
      this.getUserDropDown()
      if (this.data && this.data.id) {
          this.fillForm();
        }
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
      user: ['', Validators.required],
    });
  }

//   saveTransfer(): void {
//     const { user: userId, description, amount, date } = this.formGroup.value;
//     this.transferService
//       .addTransfer({
//         userId, description, amount, date
//       })
//       .subscribe(
//         (response) => {
//           this.snackBar.open('Transfer saved successfully', 'OK', {
//             duration: 3000
//           });
//           this.dialogRef.close(true);
//         },
//         (error) => {
//           this.snackBar.open(
//             (error.error && error.error.message) || error.message,
//             'Ok', {
//             duration: 3000
//           }
//           );
//         },
//         () => { }
//       );
//   }

//   updateTransfer(): void {
//     const { user: userId, description, amount, date } = this.formGroup.value;
//     this.transferService
//       .editTransfer({
//         id: this.data.id,
//         userId, description, amount, date
//       })
//       .subscribe(
//         (response) => {
//           this.snackBar.open('transfer updated successfully', 'OK', {
//             duration: 3000
//           });
//           this.dialogRef.close(true);
//         },
//         (error) => {
//           this.snackBar.open(
//             (error.error && error.error.message) || error.message,
//             'Ok', {
//             duration: 3000
//           }
//           );
//         },
//         () => { }
//       );
//   }

  onSubmit() {
    if (this.data && this.data.id) {
  //      this.updateTransfer();
    } else {
    //  this.saveTransfer();
    }
  }

  fillForm() {
    const { user_id: userId, description: description, amount: amount, date: date } = this.data;
    this.formGroup.patchValue({
      description,
      amount,
      user: userId,
      date: date
    });
  }

  getUserDropDown() {
    this.userService
      .getUserDropDown()
      .subscribe(
        (response) => {
          this.users = response
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
}
