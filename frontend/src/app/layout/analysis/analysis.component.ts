import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import * as Highcharts from 'highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { IMatTableParams, ISelectedDate } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { CategoriesService } from '../expense/services/categories.service';
import { ItemsService } from '../items/services/items.service';
import { SalesService } from '../sales/services/sales.service';
import { AnalysisService } from './services/analysis.service';
import { IAnalysisData } from 'src/app/models/analysis';
import * as moment from 'moment';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

    categories = [];
    suppliers;
    items = [];
    customers = [];

    public sale: any = {
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
            name: 'Qty',
            data: []
        }]
    }
    public purchase: any = {
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
            name: 'Purchase',
            data: []
        }, {
            name: 'Qty',
            data: []
        }]
    }
    //
    dataSource: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public defaultPageSize = PAGE_SIZE;
    public pageSizeOptions = PAGE_SIZE_OPTION;
    @ViewChild(MatSort) sort: MatSort;
    loader: boolean = false;

    saleChart;
    purchaseChart;


    totalSaleInSaleChartWise: number = 0;
    totalQtyInSaleChartWise: number = 0;
    averageSaleInSaleChartWise: number = 0;
    averageQtyInSaleChartWise: number = 0;
    totalPurchaseInPurchaseChartWise: number = 0;
    totalQtyInPurchaseChartWise: number = 0;
    averagePurchaseInPurchaseChartWise: number = 0;
    averageQtyInPurchaseChartWise: number = 0;



    @ViewChild('select') select: MatSelect;
    allSelectedCategories: boolean = false;
    @ViewChild('select1') select1: MatSelect;
    allSelectedSuppliers: boolean = false;
    @ViewChild('select2') select2: MatSelect;
    allSelectedItems: boolean = false;
    @ViewChild('select3') select3: MatSelect;
    allSelectedCustomers: boolean = false;
    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        public snackBar: MatSnackBar,
        private categoriesService: CategoriesService,
        private salesService: SalesService,
        private analysisService: AnalysisService
    ) { }
    ngOnInit(): void {
        this.getCategoryDropDown('Item');
        this.getSuppliersDropDown();
        this.getItemDropDown();
        this.getCustomerDropDown();
    }

    // getSaleChart() {
    //     let convertedSalesDate;
    //     this.analysisService
    //         .saleChart({ startDate: this.startDate, endDate: this.endDate } as ISelectedDate
    //         )
    //         .subscribe(
    //             (response) => {
    //                 this.saleChart = response
    //                 for (let index = 0; index < this.saleChart.length; index++) {
    //                     const element = this.saleChart[index];
    //                     this.totalSaleInSaleChartWise = +this.totalSaleInSaleChartWise + +element.sales_amount;
    //                     this.totalQtyInSaleChartWise = +this.totalQtyInSaleChartWise + +element.sales_qty;
    //                     this.averageSaleInSaleChartWise = (this.totalSaleInSaleChartWise / 30)
    //                     this.averageQtyInSaleChartWise = (this.totalQtyInSaleChartWise / 30)
    //                 }
    //                 for (let index = 0; index < this.daysArray.length; index++) {
    //                     const arraySignalDate = this.daysArray[index];
    //                     const salesDate = this.saleChart.find(x => {
    //                         convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
    //                         return convertedSalesDate === arraySignalDate;
    //                     })
    //                     if (arraySignalDate !== convertedSalesDate) {
    //                         this.sale.xAxis.categories.push(arraySignalDate)
    //                         this.sale.series[0].data.push(0);
    //                         this.sale.series[1].data.push(0);
    //                     } else (
    //                         this.sale.xAxis.categories.push(arraySignalDate),
    //                         this.sale.series[0].data.push(+salesDate.sales_amount),
    //                         this.sale.series[1].data.push(+salesDate.sales_qty)
    //                     )
    //                 }
    //                 Highcharts.chart('saleChartData', this.sale);
    //             },
    //             (error) => {
    //                 this.snackBar.open(
    //                     (error.error && error.error.message) || error.message,
    //                     'Ok', {
    //                     duration: 3000
    //                 }
    //                 );
    //             },
    //             () => { }
    //         );
    // }
    // getPurchaseChart() {
    //     let convertedSalesDate;
    //     this.analysisService
    //         .purchaseChart({ startDate: this.startDate, endDate: this.endDate } as ISelectedDate
    //         )
    //         .subscribe(
    //             (response) => {
    //                 this.purchaseChart = response;
    //                 this.totalPurchaseInPurchaseChartWise = 0;
    //                 this.totalQtyInPurchaseChartWise = 0;
    //                 this.averagePurchaseInPurchaseChartWise = 0;
    //                 this.averageQtyInPurchaseChartWise = 0;
    //                 //    while( this.purchase.series.length > 0) {
    //                 //        this.purchase.series[0].remove(true);
    //                 //     }
    //                 //     while( this.purchase.xAxis.categories.length > 0) {
    //                 //         this.purchase.xAxis.categories.remove(true);
    //                 //      }
    //                 //     Highcharts.chart('purchaseChartData', this.purchase);
    //                 for (let index = 0; index < this.purchaseChart.length; index++) {
    //                     const element = this.purchaseChart[index];
    //                     this.totalPurchaseInPurchaseChartWise = +this.totalPurchaseInPurchaseChartWise + +element.purchase_amount;
    //                     this.totalQtyInPurchaseChartWise = +this.totalQtyInPurchaseChartWise + +element.purchase_qty;
    //                     this.averagePurchaseInPurchaseChartWise = (this.totalPurchaseInPurchaseChartWise / 30);
    //                     this.averageQtyInPurchaseChartWise = (this.totalQtyInPurchaseChartWise / 30);
    //                 }
    //                 for (let index = 0; index < this.daysArray.length; index++) {
    //                     const arraySignalDate = this.daysArray[index];
    //                     const purchaseDate = this.purchaseChart.find(x => {
    //                         convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
    //                         return convertedSalesDate === arraySignalDate;
    //                     })
    //                     if (arraySignalDate !== convertedSalesDate) {
    //                         this.purchase.xAxis.categories.push(arraySignalDate)
    //                         this.purchase.series[0].data.push(0);
    //                         this.purchase.series[1].data.push(0);
    //                     } else (
    //                         this.purchase.xAxis.categories.push(arraySignalDate),
    //                         this.purchase.series[0].data.push(+purchaseDate.purchase_amount),
    //                         this.purchase.series[1].data.push(+purchaseDate.purchase_qty)
    //                     )
    //                 }
    //                 Highcharts.chart('purchaseChartData', this.purchase);
    //             },
    //             (error) => {
    //                 this.snackBar.open(
    //                     (error.error && error.error.message) || error.message,
    //                     'Ok', {
    //                     duration: 3000
    //                 }
    //                 );
    //             },
    //             () => { }
    //         );
    // }



    getCategoryDropDown(type: string) {
        this.categoriesService
            .getCategoryDropDown(type)
            .subscribe(
                (response) => {
                    this.categories = response
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

    getSuppliersDropDown() {
        // this.selectSupplierLoader = true;
        this.itemsService
            .getSupplierDropDown()
            .subscribe(
                (response) => {
                    this.suppliers = response;
                    //this.selectSupplierLoader = false;
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

    getItemDropDown() {
        //  this.selectItemLoader = true;
        this.salesService
            .getItemDropDown()
            .subscribe(
                (response) => {
                    this.items = response;
                    //      this.selectItemLoader = false;
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

    getCustomerDropDown() {
        //this.selectCustomerLoader = true;
        this.salesService
            .getCustomerDropDown()
            .subscribe(
                (response) => {
                    this.customers = response;
                    //    this.selectCustomerLoader = false;
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
