import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICustomersData } from 'src/app/models/customers';
import { ItemsService } from '../services/items.service';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string
    tires = []
    isShowLoader = false;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ICustomersData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddItemComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private router: Router,
        private itemsService:ItemsService
    ) { }

    ngOnInit() {
        this.initializeForm();
        if (this.data && this.data.id) {
            this.fillForm();
        }
    }

    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            company: ['', Validators.required],
            firstName: ['', Validators.required],
            address: ['', Validators.required],
            email: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            dueLimit: ['', Validators.required],
            balance: ['', Validators.required],
            other: ['', Validators.required],
            tier: ['', Validators.required],
        });
    }

    saveItems(): void {
        const { company, firstName, address, email, mobileNumber, dueLimit, balance, other, tier: tierId } = this.formGroup.value;
        this.isShowLoader = true;

        this.itemsService
            .addItems({
                company,
                firstName,
                address,
                email,
                mobileNumber,
                dueLimit,
                balance,
                other,
                tierId
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;

                    this.snackBar.open('User saved successfully', 'OK', {
                        duration: 3000
                    });
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

    updateItems(): void {
        const { company, firstName, address, email, mobileNumber, dueLimit, balance, other, tier: tierId } = this.formGroup.value;
        this.isShowLoader = true;

        this.itemsService
            .editItems({
                id: this.data.id,
                company,
                firstName,
                address,
                email,
                mobileNumber,
                dueLimit,
                balance,
                other,
                tierId
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;

                    this.snackBar.open('User updated successfully', 'OK', {
                        duration: 3000
                    });
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
        if (this.data && this.data.id) {
            this.updateItems();
        } else {
            this.saveItems();
        }
    }

    fillForm() {
        const { company: company, first_name: firstName, address: address, email: email, mobile_no: mobileNumber, due_limit: dueLimit, balance: balance, other: other, tier_id: tierId } = this.data;
        this.formGroup.patchValue({
            company,
            firstName,
            address,
            email,
            mobileNumber,
            dueLimit,
            balance,
            other,
            tier: tierId
        });
    }


}
