import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-print',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
    user: string;
    sr: number;
    date: string;
    no: number;
    qty: number;
    item: string;
    price: number;
    amount: number;
    totalQty: number;
    total: number;
    lastDue: number = 0;
    grandTotal: number;
    shipping: number;
    gst: number;
    totalDue: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<PrintComponent>,


    ) { }
    ngOnInit() {
        console.log(this.data);
            this.user = this.data.user_name,
            this.sr = this.data.sr,
            this.date = this.data.date,
            this.no = this.data.sr,
            this.qty = this.data.qty,
            // this.item = this.data.d,
            // this.price = this.data.d,
            this.amount = this.data.amount,
            this.totalQty = this.data.qty,
            this.total = this.data.total,
            this.grandTotal = this.data.amount,
            this.shipping = this.data.shipping,
            this.gst = this.data.gst,
            this.totalDue = this.data.total_due
    }
    print() {
        let prtContent = document.getElementById("print");
        let WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
    }

}
