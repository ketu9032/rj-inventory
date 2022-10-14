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
import { Chart } from 'chart.js';
import { AnalysisService } from './services/analysis.service';
import { IAnalysisData } from 'src/app/models/analysis';
import * as moment from 'moment';

// declare var require: any;
// const More = require('highcharts/highcharts-more');
// More(Highcharts);

// const Exporting = require('highcharts/modules/exporting');
// Exporting(Highcharts);

// const ExportData = require('highcharts/modules/export-data');
// ExportData(Highcharts);

// const Accessibility = require('highcharts/modules/accessibility');
// Accessibility(Highcharts);
@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

    displayedColumns: string[] = [
        'item_code',
        'item_name',
        'qty_30_days',
        'qty_15_days',
        'qty_7_days',
        'prediction_target',
        'int_qty',
        'required'
    ];

    categories = [];
    suppliers;
    items = [];
    customers = [];
    fromDate: string;
    toDate: string;

    //
    public profit: any = {
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
    totalRows: number;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    thirtyDays: number = 20;
    fifteenDays: number = 30;
    sevenDays: number = 50;
    futureDays: number = 7;
    profitChart;
    saleChart;
    purchaseChart;
    startDate: Date;
    endDate: Date;
    daysArray = []
    formatChangeDate

    selectedDate: ISelectedDate = {
        startDate: moment(moment(), "DD-MM-YYYY").add(-11, 'days'),
        endDate: moment(moment(), "DD-MM-YYYY").add(18, 'days'),
    }


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
        this.getAnalysis();
        this.getDaysArray(this.selectedDate.startDate, this.selectedDate.endDate);
    }

    getAnalysis() {
        this.loader = true;
        if (this.fromDate) {
            this.tableParams.fromDate = this.fromDate
        }
        if (this.toDate) {
            this.tableParams.toDate = this.toDate
        }
        this.analysisService.getAnalysis(this.tableParams).subscribe(
            (newAnalysis: any[]) => {
                this.dataSource = new MatTableDataSource<IAnalysisData>(newAnalysis);
                if (newAnalysis.length > 0) {
                    this.totalRows = newAnalysis[0].total;
                }
                setTimeout(() => {
                    this.paginator.pageIndex = this.tableParams.pageNumber - 1;
                    this.paginator.length = +this.totalRows;
                });
                this.loader = false;
            },
            (error) => {
                this.loader = false;
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }
    getProfitChart() {
        debugger
        if (this.startDate) {
            this.selectedDate.startDate = moment(this.startDate).format("DD-MM-YYYY")

        }
        if (this.endDate) {
            this.selectedDate.endDate = moment(this.endDate).format("DD-MM-YYYY")
        }
        let convertedSalesDate;
        let convertedPurchaseDate;
        this.analysisService
            .profitChart(this.selectedDate
            )
            .subscribe(
                (response) => {
                    this.profitChart = response
                    for (let index = 0; index < this.daysArray.length; index++) {
                        const arraySignalDate = this.daysArray[index];
                        const salesDate = this.profitChart.res1.find(x => {
                            convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedSalesDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedSalesDate) {
                            this.profit.xAxis.categories.push(arraySignalDate)
                            this.profit.series[0].data.push(0);
                        } else (
                            this.profit.xAxis.categories.push(arraySignalDate),
                            this.profit.series[0].data.push(+salesDate.sa)
                        )
                        const purchaseDate = this.profitChart.res2.find(x => {
                            convertedPurchaseDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedPurchaseDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedPurchaseDate) {
                            this.profit.series[1].data.push(0);
                        } else (
                            this.profit.series[1].data.push(+purchaseDate.pa)
                        )
                    }
                    Highcharts.chart('profitChartData', this.profit);

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
    getSaleChart() {
        if (this.startDate) {
            this.selectedDate.startDate = moment(this.startDate).format("DD-MM-YYYY")
        }
        if (this.endDate) {
            this.selectedDate.endDate = moment(this.endDate).format("DD-MM-YYYY")
        }
        let convertedSalesDate;
        this.analysisService
            .saleChart(this.selectedDate
            )
            .subscribe(
                (response) => {

                    this.saleChart = response
                    for (let index = 0; index < this.daysArray.length; index++) {
                        const arraySignalDate = this.daysArray[index];
                        const salesDate = this.saleChart.find(x => {
                            convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedSalesDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedSalesDate) {
                            this.sale.xAxis.categories.push(arraySignalDate)
                            this.sale.series[0].data.push(0);
                            this.sale.series[1].data.push(0);
                        } else (
                            this.sale.xAxis.categories.push(arraySignalDate),
                            this.sale.series[0].data.push(+salesDate.sales_amount),
                            this.sale.series[1].data.push(+salesDate.sales_qty)
                        )

                    }
                    Highcharts.chart('saleChartData', this.sale);

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
    getPurchaseChart() {
        if (this.startDate) {
            this.selectedDate.startDate = moment(this.startDate).format("DD-MM-YYYY")
        }
        if (this.endDate) {
            this.selectedDate.endDate = moment(this.endDate).format("DD-MM-YYYY")
        }
        let convertedSalesDate;
        this.analysisService
            .purchaseChart(this.selectedDate
            )
            .subscribe(
                (response) => {

                    this.purchaseChart = response
                    for (let index = 0; index < this.daysArray.length; index++) {
                        const arraySignalDate = this.daysArray[index];
                        const purchaseDate = this.purchaseChart.find(x => {
                            convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedSalesDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedSalesDate) {
                            this.purchase.xAxis.categories.push(arraySignalDate)
                            this.purchase.series[0].data.push(0);
                            this.purchase.series[1].data.push(0);
                        } else (
                            this.purchase.xAxis.categories.push(arraySignalDate),
                            this.purchase.series[0].data.push(+purchaseDate.purchase_amount),
                            this.purchase.series[1].data.push(+purchaseDate.purchase_qty)
                        )

                    }
                    Highcharts.chart('purchaseChartData', this.purchase);

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

    getDaysArray(startDate, endDate) {
        for (var arr = [], dt = new Date(startDate); dt <= new Date(endDate); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            this.formatChangeDate = moment(element).format("DD-MM-YYYY");
            this.daysArray.push(this.formatChangeDate)
        }
        return this.daysArray;
    };

    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
    }

    toggleAllSelectionByCategories() {
        if (this.allSelectedCategories) {
            this.select.options.forEach((item: MatOption) => item.select());
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickCategories() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedCategories = newStatus;
    }

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
    toggleAllSelectionBySuppliers() {
        if (this.allSelectedSuppliers) {
            this.select1.options.forEach((item: MatOption) => item.select());
        } else {
            this.select1.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickSuppliers() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedSuppliers = newStatus;
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
    toggleAllSelectionByItems() {
        if (this.allSelectedItems) {
            this.select2.options.forEach((item: MatOption) => item.select());
        } else {
            this.select2.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickItems() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedSuppliers = newStatus;
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
    toggleAllSelectionByCustomers() {
        if (this.allSelectedCustomers) {
            this.select3.options.forEach((item: MatOption) => item.select());
        } else {
            this.select3.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickCustomers() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedCustomers = newStatus;
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

    getPrediction(qty30Days, qty15Days, qty7Days) {
        return (+(+(+(qty30Days * this.thirtyDays) / 100) + +((qty15Days * this.fifteenDays) / 100) + +((qty7Days * 50) / 100)) / (30)) * this.futureDays;
    }

    getRequired(intQty, qty30Days, qty15Days, qty7Days) {
        return (+intQty * 100) / ((((+((+qty30Days * this.thirtyDays) / 100) + ((+qty15Days * this.fifteenDays) / 100) + ((+qty7Days * this.sevenDays) / 100)) / (30)) * this.futureDays) * this.futureDays)
    }

}
