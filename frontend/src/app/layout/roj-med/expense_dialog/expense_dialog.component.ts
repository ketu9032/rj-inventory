import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { RojMedService } from '../services/roj_med.service';
@Component({
    selector: 'app-sale_dialog',
    templateUrl: './expense_dialog.component.html',
    styleUrls: ['./expense_dialog.component.scss']
})
export class ExpenseDialogComponent implements OnInit {
    dataSource: any = [];
    loader: boolean = false;
    active: boolean = true;
     userId : number;
    user_name: string
    date;
    displayedColumns: string[] = [
        'date',
        'description',
        'category_code',
        'amount'
    ];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { userId: number},
        private rojMedService: RojMedService,
        private snackBar: MatSnackBar,
    ) { }
    ngOnInit() {
        this.getExpenseByByUsers();
    }
    getExpenseByByUsers(){
        this.loader = true
        this.rojMedService
         .getExpenseByUserId(this.data.userId)
         .subscribe(
            (response: any[]) => {
                this.dataSource = new MatTableDataSource<any>(response)
                this.user_name = response[0].user_name;
                this.date = response[0].date;
                this.loader = false;
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
            () => { }
        );
    }
}
