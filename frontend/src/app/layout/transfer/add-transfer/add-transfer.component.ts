import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ITransferData } from 'src/app/models/transfer';
import { IUserData } from 'src/app/models/user';
import { UserService } from '../../user/services/user.service';
import { TransferService } from '../services/transfer.service';
@Component({
    selector: 'app-add-transfer',
    templateUrl: './add-transfer.component.html',
    styleUrls: ['./add-transfer.component.scss']
})
export class AddTransferComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string
    users = []
    isShowLoader = false;
    currentDate = new Date();
    loggedInUser: any;
    numberRegEx = /\-?\d*\.?\d{1,2}/;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ITransferData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddTransferComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private router: Router,
        private transferService: TransferService,
        private userService: UserService,
        public authService: AuthService,
    ) { }
    ngOnInit() {
        this.initializeForm();
        this.getUserDropDown()
        this.loggedInUser = this.authService.getUserData();
        if (this.data && this.data.transferId) {
            this.fillForm();
        }
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({

            description: ['', Validators.required],
            amount: ['', Validators.required],
            // amount: ['', Validators.required, Validators.pattern(this.numberRegEx)],
            toUserId: ['', Validators.required],
        });
    }
    saveTransfer(): void {
        const { toUserId, description, amount } = this.formGroup.value;
        const fromUserId = this.loggedInUser.id;
        this.isShowLoader = true;
        this.transferService
            .addTransfer({
                toUserId, description, amount, fromUserId
            })
            .subscribe(
                (response) => {
                    this.snackBar.open('Transfer saved successfully', 'OK', {
                        duration: 3000
                    });
                    this.isShowLoader = false;
                    this.dialogRef.close(true);
                },
                (error) => {
                    this.isShowLoader = false;
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
    updateTransfer(): void {
        const { toUserId, description, amount } = this.formGroup.value;
        const fromUserId = this.loggedInUser.id;
        this.isShowLoader = true;
        this.transferService
            .editTransfer({
                transferId: this.data.transferId,
                toUserId, description, amount, fromUserId
            })
            .subscribe(
                (response) => {
                    this.snackBar.open('transfer updated successfully', 'OK', {
                        duration: 3000
                    });
                    this.isShowLoader = false;
                    this.dialogRef.close(true);
                },
                (error) => {
                    this.isShowLoader = false;
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
        if (this.data && this.data.transferId) {
            this.updateTransfer();
        } else {
            this.saveTransfer();
        }
    }
    fillForm() {
        const { toUserId, description: description, amount: amount } = this.data;
        this.formGroup.patchValue({
            description,
            amount,
            toUserId,

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
