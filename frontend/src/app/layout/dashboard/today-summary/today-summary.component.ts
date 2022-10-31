import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DashboardService } from '../services/dashboard.service';

@Component({
    selector: 'app-today-summary',
    templateUrl: './today-summary.component.html',
    styleUrls: ['./today-summary.component.scss']
})
export class TodaySummaryComponent implements OnInit {
    invoice: number = 0;
    sales: number = 0;
    profit: number = 0;
    payment: number = 0;
    qty: number = 0;
    expense: number = 0;

    constructor(
        private dashboardService : DashboardService,
        public snackBar: MatSnackBar,
    ){}

    ngOnInit() {
       this.getTodaySummaryData();
    }

    getTodaySummaryData() {
        this.dashboardService
            .todaySummary()
            .subscribe(
                (response) => {
                         this.invoice = response.res1[0].invoice
                         this.payment = response.res1[0].payment
                        this.sales = response.res2[0].sales_amount;
                        this.qty = response.res2[0].sales_qty;

                        if(response.res3[0].purchase === null && response.res3[0].purchase === undefined ){
                            response.res3[0].purchase = 0

                        }
                        this.profit = +this.sales -  +response.res3[0].purchase
                        if( response.res4[0].cash_out === null &&  response.res4[0].cash_out === undefined ){
                            response.res4[0].cash_out = 0

                        }
                    this.expense = response.res4[0].cash_in - response.res4[0].cash_out
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
