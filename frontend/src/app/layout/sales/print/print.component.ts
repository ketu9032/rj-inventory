import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ISalesBillData } from 'src/app/models/sales_bill';
import { UserService } from '../../user/services/user.service';
import { SalesBillService } from '../services/sales-bill.service';
import { SalesService } from '../services/sales.service';

@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
    userId: number;
    sr: number;
    token: number;
    qty: number;
    item: string;
    price: number;
    amount: number;
    totalQty: number;
    total: number;
    lastDue: number = 0;
    grandDueTotal: number;
    payment: number;
    other_payment: number;
    totalDue: number;
userName: string;
customer: string
tier:string;
currentDate = new Date();
    salesItemDataSource: any = [];
    saleItems= [];
    salesData= [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<PrintComponent>,
        public snackBar: MatSnackBar,
        private salesBillService: SalesBillService,
        private salesService: SalesService,




    ) { }
    ngOnInit() {
       console.log(this.data.salesId);
       this.getItemsBySalesId();
       this.getSalesById();
    }
    print() {
        // let prtContent = document.getElementById("print");
        // let WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        // WinPrint.document.write(prtContent.innerHTML);
        // WinPrint.document.close();
        // WinPrint.focus();
        // WinPrint.print();
    }
  getItemsBySalesId() {
        // this.salesBillService.getItemsBySalesId(this.data.salesId).subscribe(
        //     (response) => {

        //         this.saleItems.push(...response)
        //         this.calculate();
        //         this.salesItemDataSource = new MatTableDataSource<ISalesBillData>(response);
        //       console.log(this.saleItems);

        //     },
        //     (error) => {
        //         this.snackBar.open(error.error.message || error.message, 'Ok', {
        //             duration: 3000
        //         });
        //     },
        //     () => { }
        // );
    }
    getSalesById() {
        // this.salesService.getSalesById(this.data.salesId).subscribe(
        //     (response) => {
        //         console.log(response);
        //         this.userName = response[0].user_name
        //         this.lastDue = response[0].past_due
        //         this.customer = response[0].customer
        //         this.payment = response[0].payment
        //         this.other_payment = response[0].other_payment
        //         this.tier = response[0].tier
        //         this.token = response[0].token
        //         this.calculate();
        //     },
        //     (error) => {
        //         this.snackBar.open(error.error.message || error.message, 'Ok', {
        //             duration: 3000
        //         });
        //     },
        //     () => { }
        // );
    }
    calculate() {
        this.totalQty = 0
        this.total = 0;
        this.saleItems.forEach(saleItem => {
            this.totalQty = +this.totalQty + +saleItem.qty;
            this.total = +this.total + (+saleItem.qty * +saleItem.selling_price);
        });
        //this.grandDueTotal  = this.total;
         this.grandDueTotal = (+this.total + +this.lastDue);
        this.totalDue = +this.grandDueTotal ;
    }

}
