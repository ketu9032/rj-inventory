import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { RojMedService } from '../services/roj_med.service';
@Component({
    selector: 'app-sale_dialog',
    templateUrl: './sale_dialog.component.html',
    styleUrls: ['./sale_dialog.component.scss']
})
export class SaleDialogComponent implements OnInit {
    dataSource: any = [];
    loader: boolean = false;
    active: boolean = true;
    sales;
    userId : number;
    user_name: string
    date;
    displayedColumns: string[] = [
        'bill_no',
        'date',
        'customer',
        'grand_total',
        'payment',
        'other_payment',
        'total_due'
    ];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { userId: number},
        private rojMedService: RojMedService,
        private snackBar: MatSnackBar,
    ) { }
    ngOnInit() {
        this.data
        this.getSalesByUsers();
    }
    getSalesByUsers(){
        this.loader = true
        this.rojMedService
         .getSalesByUserId(this.data.userId)
         .subscribe(
            (response: any[]) => {
                this.loader = false;
                this.dataSource = new MatTableDataSource<any>(response)
                this.user_name = response[0].user_name;
                this.date = response[0].date;
            },
            (error) => {
                this.loader = false;
                this.snackBar.open(
                    (error.error && error.error.message) || error.message,
                    'Ok', {
                    duration: 3000
                }
                );
            },
            () => {
                this.loader = false;
            }
        );
    }
}
