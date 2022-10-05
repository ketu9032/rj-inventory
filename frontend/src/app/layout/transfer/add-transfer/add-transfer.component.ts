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
    loggedInUserId: any;
    loggedInUser: boolean = false;
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
        this.loggedInUserId = this.authService.getUserData();
        if (this.data && this.data.transferId) {
            this.fillForm();
        }
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            description: ['', Validators.required],
            transfer_amount: ['', Validators.required],
            toUserId: ['', Validators.required],
        });
    }
    saveTransfer(): void {
        const { toUserId, description, transfer_amount } = this.formGroup.value;
        const fromUserId = this.loggedInUserId.id;
        this.isShowLoader = true;
        this.transferService
            .addTransfer({
                toUserId, description, transfer_amount, fromUserId
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
        const { toUserId, description, transfer_amount } = this.formGroup.value;
        const fromUserId = this.loggedInUserId.id;
        this.isShowLoader = true;
        this.transferService
            .editTransfer({
                transferId: this.data.transferId,
                toUserId, description, transfer_amount, fromUserId
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
        const { toUserId, description: description, transfer_amount: transfer_amount } = this.data;
        this.formGroup.patchValue({
            description,
            transfer_amount,
            toUserId,
        });
    }
    getUserDropDown() {
        this.userService
            .getUserDropDown(this.loggedInUser)
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
