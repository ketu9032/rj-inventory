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
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { CategoriesService } from '../expense/services/categories.service';
import { ItemsService } from '../items/services/items.service';
import { SalesService } from '../sales/services/sales.service';
import { Chart } from 'chart.js';
import { AnalysisService } from './services/analysis.service';
import { IAnalysisData } from 'src/app/models/analysis';

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
    public options: any = {
        chart: {
            type: 'column'
        },
        accessibility: {
            description: '',
        },
        title: {
            text: ''
        },
        // subtitle: {
        //     text: '{{sss}}'
        // },
        xAxis: {
            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania', 'Africa', 'America', 'Asia', 'Europe', 'Oceania', 'Africa', 'America', 'Asia', 'Europe', 'Oceania', 'Africa', 'America', 'Asia', 'Europe', 'Oceania', 'Africa', 'America', 'Asia', 'Europe', 'Oceania', 'Africa', 'America', 'Asia', 'Europe', 'Oceania'],
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
            valueSuffix: ' millions'
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
            data: [12016, 10001, 40436, 73008, 40000, 12016, 10001, 40436, 738, 400, 12016, 10001, 44036, 7308, 400, 12106, 10001, 44306, 738, 4000, 10216, 10001, 4436, 7380, 400, 12106, 10001, 44306, 7308, 400,]
        }, {
            name: 'Profit',
            data: [1416, 1101, 44086, 70000, 405, 1416, 1101, 44860, 7500, 405, 14016, 11001, 4486, 750, 405, 14016, 1101, 44086, 4750, 405, 1416, 1101, 4486, 750, 405, 1416, 11001, 4486, 7500, 40005,]
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
        Highcharts.chart('container', this.options);
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
