import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from '../../sales/services/sales.service';
import { salesQuotationService } from '../services/sales-quotation.service';
@Component({
    selector: 'app-move-sales',
    templateUrl: './move-sales.component.html',
    styleUrls: ['./move-sales.component.scss']
})
export class MoveSalesComponent implements OnInit {
    selectCustomerLoader: boolean = false;
    isShowLoader: boolean = false;
    customers;
    payment: number = 5;
    sales;
    customer: string;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<MoveSalesComponent>,
        private salesQuotationService: salesQuotationService,
        private salesService: SalesService,
        public snackBar: MatSnackBar,

    ) { }
    ngOnInit() {
        console.log(this.data);
        this.getCustomerDropDown()
    }
    saveSalesQuotation(): void {
        this.isShowLoader = true;
        this.salesQuotationService
            .addSalesQuotationToSales({
                date: this.data.date,
                invoice_no: this.data.invoice_no,
                qty: this.data.qty,
                amount: this.data.amount,
                total_due: this.data.total_due,
                user_name: this.data.user_name,
                tier: this.data.tier,
                remarks: this.data.remarks,
                customer:this.customer,
                payment: this.payment,
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

    removeSales(): void {
        this.salesQuotationService.removeSalesQuotation(this.data.id).subscribe(
          (response) => {


          },
          (error) => {
            this.snackBar.open(error.error.message || error.message, 'Ok',{
              duration: 3000
            });
          },
          () => {}
        );
      }
}
