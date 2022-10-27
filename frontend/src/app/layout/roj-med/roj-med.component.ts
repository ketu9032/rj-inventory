import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ExpenseDialogComponent } from './expense_dialog/expense_dialog.component';
import { PurchaseDialogComponent } from './purchase_dialog/purchase_dialog.component';
import { ReceiveDialogComponent } from './receive_dialog/receive_dialog.component';
import { SaleDialogComponent } from './sale_dialog/sale_dialog.component';
import { RojMedService } from './services/roj_med.service';
import { TransferDialogComponent } from './transfer_dialog/transfer_dialog.component';
@Component({
    selector: 'app-roj-med',
    templateUrl: './roj-med.component.html',
    styleUrls: ['./roj-med.component.scss']
})
export class RojMedComponent implements OnInit {
    defaultPageSize = PAGE_SIZE;
    loader: boolean = false;
    fromDate: any;
    toDate: any;
    users: [] = [];
    sales: [] = [];
    currentDate = moment(new Date()).format("YYYY-MM-DD")
    //  currentDate  =  (new Date().getTimezoneOffset())
    //  currentDate = new Date();
    ngOnInit() {
        this.getRojMed()
    }
    constructor(
        private rojMedService: RojMedService,
        public snackBar: MatSnackBar,
        private dialog: MatDialog,
    ) { }
    getRojMed() {
        this.rojMedService
            .getRojMedData(this.currentDate)
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
    saleDialog(userId: number): void {
        this.dialog
            .open(SaleDialogComponent, {
                width: '1000px',
                height: '550px',
                data: { userId: userId, date: this.currentDate }
            })
            .afterClosed()
            .subscribe(() => {
            });
    }
    receiveDialog(userId: number): void {
        this.dialog
            .open(ReceiveDialogComponent, {
                width: '1000px',
                height: '550px',
                data: { userId: userId, date: this.currentDate }
            })
            .afterClosed()
            .subscribe(() => {

            });
    }
    transferDialog(userId: number): void {
        this.dialog
            .open(TransferDialogComponent, {
                width: '1000px',
                height: '550px',
                data: { userId: userId, date: this.currentDate }
            })
            .afterClosed()
            .subscribe(() => {
            });
    }
    purchaseDialog(userId: number): void {
        this.dialog
            .open(PurchaseDialogComponent, {
                width: '1000px',
                height: '550px',
                data: { userId: userId, date: this.currentDate }
            })
            .afterClosed()
            .subscribe(() => {
            });
    }
    expenseDialog(userId: number): void {
        this.dialog
            .open(ExpenseDialogComponent, {
                width: '1000px',
                height: '550px',
                data: { userId: userId, date: this.currentDate }
            })
            .afterClosed()
            .subscribe(() => {
            });
    }
}
