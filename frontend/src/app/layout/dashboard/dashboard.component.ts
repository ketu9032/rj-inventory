import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { ISelectedDate } from 'src/app/models/table';
import { AnalysisService } from '../analysis/services/analysis.service';
import { DashboardService } from './services/dashboard.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    loader: boolean = false;
    invoice: number = 0;
    sales: number = 0;
    profit: number = 0;
    payment: number = 0;
    qty: number = 0;
    expense: number = 0;
    startDate: any;
    endDate: any;
    totalSaleInDayWise: number = 0;
    totalProfitInDayWise: number = 0;
    averageSaleInDayWise: number = 0;
    averageProfitInDayWise: number = 0;
    customer: number = 0;
    supplier: number = 0;
    product: number = 0;
    companyBalance: number = 2021250450;
    dayChart;
    formatChangeDate;
    daysArray = []

    todaySummary: any;


    selectedDate: ISelectedDate = {
        startDate: moment(moment(), "DD-MM-YYYY").add(-11, 'days'),
        endDate: moment(moment(), "DD-MM-YYYY").add(18, 'days'),
    }

    public dayWiseChart: any = {
        chart: {
            type: 'column'
        },
        accessibility: {
            description: '',
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [],
            tickmarkPlacement: 'on',
            title: {
                enabled: false
            }
        },
        yAxis: {
            min: 0,

            title: {
                text: 'Amount (RS.)',
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'below',
            x: -40,
            y: 80,
            floating: true,
            borderWidth: 1,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: true
        },
        series: [{
            name: 'Sale',
            data: []
        }, {
            name: 'Profit',
            data: []
        }]
    }

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
        private dashboardService: DashboardService,
        public snackBar: MatSnackBar,
        private analysisService: AnalysisService

    ) { }
    ngOnInit() {
        this.getTodaySummaryData();
        this.getDayWiseSalesProfitChart();
        Highcharts.chart('customerChartData', this.customerChart);
        Highcharts.chart('supplierChartData', this.purchaseChart);
    }


    getDayWiseSalesProfitChart() {
        if (this.selectedDate.startDate) {
            this.selectedDate.startDate = moment(this.startDate).format("YYYY-MM-DD")

        }
        if (this.selectedDate.endDate) {
            this.selectedDate.endDate = moment(this.endDate).format("YYYY-MM-DD")
        }
        let convertedSalesDate;
        let convertedPurchaseDate;
        // this.analysisService
        //     .profitChart(this.selectedDate
        //     )
        //     .subscribe(
        //         (response) => {
        //             this.dayChart = response

        //             for (let index = 0; index < this.dayChart.res1.length; index++) {
        //                 const element = this.dayChart.res1[index];
        //                 this.totalSaleInDayWise =       +this.totalSaleInDayWise + +element.sa

        //                 this.averageSaleInDayWise = (this.totalSaleInDayWise / 30)

        //             }

        //             for (let index = 0; index < this.dayChart.res2.length; index++) {
        //                 const element = this.dayChart.res2[index];
        //                 this.totalProfitInDayWise =        +this.totalProfitInDayWise + +element.pa
        //                 this.averageProfitInDayWise =  (this.totalProfitInDayWise / 30)

        //             }

        //             for (let index = 0; index < this.daysArray.length; index++) {
        //                 const arraySignalDate = this.daysArray[index];
        //                 const salesDate = this.dayChart.res1.find(x => {
        //                     convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
        //                     return convertedSalesDate === arraySignalDate;
        //                 })
        //                 if (arraySignalDate !== convertedSalesDate) {
        //                     this.dayWiseChart.xAxis.categories.push(arraySignalDate)
        //                     this.dayWiseChart.series[0].data.push(0);
        //                 } else (
        //                     this.dayWiseChart.xAxis.categories.push(arraySignalDate),
        //                     this.dayWiseChart.series[0].data.push(+salesDate.sa)
        //                 )
        //                 const purchaseDate = this.dayChart.res2.find(x => {
        //                     convertedPurchaseDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
        //                     return convertedPurchaseDate === arraySignalDate;
        //                 })
        //                 if (arraySignalDate !== convertedPurchaseDate) {
        //                     this.dayWiseChart.series[1].data.push(0);
        //                 } else (
        //                     this.dayWiseChart.series[1].data.push(+purchaseDate.pa)
        //                 )

        //             }
        //             Highcharts.chart('profitChartData', this.dayWiseChart);

        //         },
        //         (error) => {
        //             this.snackBar.open(
        //                 (error.error && error.error.message) || error.message,
        //                 'Ok', {
        //                 duration: 3000
        //             }
        //             );
        //         },
        //         () => { }
        //     );
    }

    getDaysArray(startDate, endDate) {
        for (var arr = [], dt = new Date(startDate); dt <= new Date(endDate); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            this.formatChangeDate = moment(element).format("DD-MM-YYYY");
            this.daysArray.push(this.formatChangeDate)
        }

    };

    getTodaySummaryData() {
        this.dashboardService
            .todaySummary()
            .subscribe(
                (response) => {
                    this.todaySummary = response;

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
