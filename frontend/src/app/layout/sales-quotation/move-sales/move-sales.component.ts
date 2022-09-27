import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from '../../sales/services/sales.service';
import { salesQuotationService } from '../services/sales-quotation.service';
@Component({
    selector: 'app-move-sales',
    templateUrl: './move-sales.component.html',
    styleUrls: ['./move-sales.component.scss']
})
export class MoveSalesComponent implements OnInit {
    formGroup: FormGroup;
    selectCustomerLoader: boolean = false;
    isShowLoader: boolean = false;
    customers = [];
    payment: number;
    customer;
    balance;
    customerId
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<MoveSalesComponent>,
        private salesQuotationService: salesQuotationService,
        public snackBar: MatSnackBar,
    ) { }
    ngOnInit() {
        this.getCustomerDropDown()
        this.initializeForm();
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            customer_name: ['', Validators.required]
        }
        );
    }
    saveSalesQuotation(): void {
        this.isShowLoader = true;
     this.dialogRef.close(this.customerId );
    }
    getCustomerDropDown() {
        this.selectCustomerLoader = true;
        this.salesQuotationService
            .getCustomerDropDown()
            .subscribe(
                (response) => {
                    this.customers = response;
                    this.selectCustomerLoader = false;
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
    find(element) {
        this.customer = this.customers.find(val => {
            return (val.id) === element;
        })
        if (this.customer) {
            this.payment = +this.data.amount + +this.customer.balance
        }
    }
    removeSales(): void {
        this.salesQuotationService.removeSalesQuotation(this.data.id).subscribe(
            (response) => {
            },
            (error) => {
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }
}
