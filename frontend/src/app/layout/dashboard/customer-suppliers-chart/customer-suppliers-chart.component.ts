import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Highcharts from 'highcharts';
import { ItemsService } from '../../items/services/items.service';
import { SalesService } from '../../sales/services/sales.service';
import { AnalysisService } from '../../analysis/services/analysis.service';
import { DashboardService } from '../services/dashboard.service';
import { response } from 'express';
import { C } from '@angular/cdk/keycodes';

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
            pointFormat: '{series.name}: <b>{point.y}₹</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '₹'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} ₹',
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
            name: 'Customer',
            data: [

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
            pointFormat: '{series.name}: <b>{point.y}₹</b>'
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
                    format: '<b>{point.name}</b>: {point.y} ₹',
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
            name: 'Supplier',
            data: [

            ]
        }]
    }

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private dashboardService: DashboardService,
    ) { }

    ngOnInit(): void {
        this.getMonthWiseData();
        this.getCustomerChart();
        this.getSupplierChart();
    }

    getCustomerChart() {
        this.dashboardService
            .customerChart()
            .subscribe(
                (response) => {
                    for (let index = 0; index < response.length; index++) {
                        const element = response[index];
                        this.customerChart.series[0].data.push({ name: element.company, y: +element.customer_sales });
                    }
                    Highcharts.chart('customerChartData', this.customerChart);
                    console.log(this.customerChart);
                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );
                }, () => {

                }

            )
    }
    getSupplierChart() {
        this.dashboardService
            .supplierChart()
            .subscribe(
                (response) => {
                    for (let index = 0; index < response.length; index++) {
                        const element = response[index];
                        this.purchaseChart.series[0].data.push({ name: element.company, y: +element.purchase_sales });
                    }
                    Highcharts.chart('supplierChartData', this.purchaseChart);
                    console.log(this.customerChart);
                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );
                }, () => {

                }

            )
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
