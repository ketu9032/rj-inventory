import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<MoveSalesComponent>,
        private salesQuotationService: salesQuotationService,
        public snackBar: MatSnackBar,

    ) { }
    ngOnInit() {
        console.log(this.data);

        this.getCustomerDropDown()
    }





    onSubmit() {


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
}
