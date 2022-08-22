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
    sales;
    customer;
    balance;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<MoveSalesComponent>,
        private salesQuotationService: salesQuotationService,
        private salesService: SalesService,
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
        this.salesQuotationService
            .addSalesQuotationToSales({
                date: this.data.date,
                invoice_no: this.data.invoice_no,
                qty: this.data.qty,
                amount: this.data.amount,
                total_due: this.payment,
                user_name: this.data.user_name,
                tier: this.data.tier,
                remarks: this.data.remarks,
                customer: this.customer.company,
                pending_due: this.customer.balance,
                amount_pd_total: this.payment
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Sales quotation to sales transfer successfully', 'OK', {
                        duration: 3000
                    });
                    this.dialogRef.close(true);
                    this.removeSales();

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
            return (val.id) === element
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
