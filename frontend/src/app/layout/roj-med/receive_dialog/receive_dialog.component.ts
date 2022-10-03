import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { RojMedService } from '../services/roj_med.service';
@Component({
    selector: 'app-sale_dialog',
    templateUrl: './receive_dialog.component.html',
    styleUrls: ['./receive_dialog.component.scss']
})
export class ReceiveDialogComponent implements OnInit {
    dataSource: any = [];
    loader: boolean = false;
    active: boolean = true;
     userId : number;
    user_name: string
    date;
    displayedColumns: string[] = [
        'date',
        'description',
        'receive_amount',
        'from_user_name'
    ];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { userId: number},
        private rojMedService: RojMedService,
        private snackBar: MatSnackBar,
    ) { }
    ngOnInit() {
        this.getReceiveByUsers();
    }
    getReceiveByUsers(){
        this.loader = true
        this.rojMedService
         .getReceiveByUserId(this.data.userId)
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
