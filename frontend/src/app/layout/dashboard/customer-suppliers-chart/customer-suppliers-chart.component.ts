import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Highcharts from 'highcharts';
import { ItemsService } from '../../items/services/items.service';
import { SalesService } from '../../sales/services/sales.service';
import { AnalysisService } from '../../analysis/services/analysis.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
    selector: 'app-customer-suppliers-chart',
    templateUrl: './customer-suppliers-chart.component.html',
    styleUrls: ['./customer-suppliers-chart.component.scss']
})
export class CustomerSuppliersChartComponent implements OnInit {

    invoice: number = 0;
    sales: number = 0;
    profit: number = 0;
    payment: number = 0;
    qty: number = 0;
    expense: number = 0;

    public customerChart: any = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Customer Wise Sales'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    connectorColor: 'silver'
                }
            }
        },

        radialGradient: {
            cx: 5.50,
            cy: 4.3,
            r: 0.7
        },



        series: [{
            name: 'Share',
            data: [
                { name: 'Chrome', y: 10.24 },
                { name: 'Edge', y: 12.93 },
                { name: 'Firefox', y: 4.73 },
                { name: 'Safari', y: 2.50 },
                { name: 'Internet Explorer', y: 1.65 },
                { name: 'Other', y: 4.93 },
                { name: 'Chrome', y: 10.24 },
                { name: 'Edge', y: 12.93 },
                { name: 'Firefox', y: 4.73 },

                { name: 'Other', y: 4.93 }
            ]
        }]
    }
    public purchaseChart: any = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Supplier Wise Purchase'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    connectorColor: 'silver'
                }
            }
        },

        radialGradient: {
            cx: 5.50,
            cy: 4.3,
            r: 0.7
        },



        series: [{
            name: 'Share',
            data: [
                { name: 'Chrome', y: 10.24 },
                { name: 'Edge', y: 12.93 },
                { name: 'Firefox', y: 4.73 },
                { name: 'Safari', y: 2.50 },
                { name: 'Internet Explorer', y: 1.65 },
                { name: 'Safari', y: 2.50 },
                { name: 'Internet Explorer', y: 1.65 },
                { name: 'Other', y: 4.93 }
            ]
        }]
    }




    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        public snackBar: MatSnackBar,
        private dashboardService: DashboardService,
        private salesService: SalesService,
        private analysisService: AnalysisService
    ) { }

    ngOnInit(): void {
        this.getMonthWiseData();

        Highcharts.chart('customerChartData', this.customerChart);
        Highcharts.chart('supplierChartData', this.purchaseChart);
    }


    getMonthWiseData() {
        this.dashboardService
            .monthWiseData()
            .subscribe(
                (response) => {
                    this.invoice = response.res1[0].invoice
                    this.payment = response.res1[0].payment
                    this.sales = response.res2[0].sales_amount;
                    this.qty = response.res2[0].sales_qty;

                    if (response.res3[0].purchase === null && response.res3[0].purchase === undefined) {
                        response.res3[0].purchase = 0

                    }
                    this.profit = +this.sales - +response.res3[0].purchase
                    if (response.res4[0].cash_out === null && response.res4[0].cash_out === undefined) {
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
