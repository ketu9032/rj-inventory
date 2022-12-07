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
    loaders = {
        loader:  false,
        findBtnLoader: false,
        prevBtnLoader: false,
        nextBtnLoader: false,

    }
    fromDate: any;
    toDate: any;
    // hideShowNextBtn: boolean = false;
    users: [] = [];
    sales: [] = [];
    date;
    currentDate = moment(new Date()).format("YYYY-MM-DD")
    selectedDate;

    ngOnInit() {
        this.getRojMed()

    }
    constructor(
        private rojMedService: RojMedService,
        public snackBar: MatSnackBar,
        private dialog: MatDialog,
    ) { }
    getRojMed() {
        this.date = this.currentDate
        this.rojMedService
            .getRojMedData(this.currentDate)
            .subscribe(
                (response) => {
                    this.users = response;
                    this.date =  moment(response[0].date).format("YYYY-MM-DD") ;

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
    getRojMedBySelectedDate() {
        this.loaders.findBtnLoader = true;
        let selectedDateFormat = moment(this.selectedDate).format("YYYY-MM-DD")
        this.date = selectedDateFormat
            this.rojMedService
            .getRojMedData(selectedDateFormat)
            .subscribe(
                (response) => {
                        this.users = response;
                        this.date = moment(response[0].date).format("YYYY-MM-DD")


                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );

                },
                () => {
                }
                );
                this.loaders.findBtnLoader = false;
    }
    getRojMedByPreviousDate() {
        this.loaders.prevBtnLoader = true;
        this.date = moment(this.date).subtract(1, 'day').format("YYYY-MM-DD")
          this.rojMedService
            .getRojMedData( this.date)
            .subscribe(
                (response) => {
                        this.users = response;
                        this.date =   moment(response[0].date).format("YYYY-MM-DD")
                        this.loaders.prevBtnLoader = false;


                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );

                },
                () => {
                }
                );
                this.loaders.prevBtnLoader = false;
    }
    getRojMedByNextDate() {
        this.loaders.nextBtnLoader = true;
        let nextDate = moment(this.date).add(1, 'day').format("YYYY-MM-DD");
        this.date = nextDate;
          this.rojMedService
            .getRojMedData(nextDate)
            .subscribe(
                (response) => {
                        this.users = response;
                         this.date =  moment(response[0].date).format("YYYY-MM-DD")
                        this.loaders.nextBtnLoader = false;

                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );

                },
                () => {
                }
                );
                this.loaders.nextBtnLoader  = false;
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
