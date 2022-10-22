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
    saleChart;
    purchaseChart;
    startDate = moment().add(-30, 'days').format("YYYY-MM-DD");
    endDate = moment().format("YYYY-MM-DD");
    daysArray = []
    formatChangeDate;

    totalSaleInSaleChartWise: number = 0;
    totalQtyInSaleChartWise: number = 0;
    averageSaleInSaleChartWise: number = 0;
    averageQtyInSaleChartWise: number = 0;
    totalPurchaseInPurchaseChartWise: number = 0;
    totalQtyInPurchaseChartWise: number = 0;
    averagePurchaseInPurchaseChartWise: number = 0;
    averageQtyInPurchaseChartWise: number = 0;

    profitChartSummary= {
        totalSale: 0,
        totalProfit: 0,
        averageSale: 0,
        averageProfit: 0
    };

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
        this.getDaysArray(this.startDate, this.endDate);
        this.analysisService
            .profitChart(
                { startDate: moment(this.startDate).format("YYYY-MM-DD"), endDate: moment(this.endDate).format("YYYY-MM-DD") } as ISelectedDate
            )
            .subscribe(
                (response: {res1: any[], res2: any[]}) => {
                    this.profitChartSummary.totalSale = 0;
                    this.profitChartSummary.averageSale = 0;
                    this.profitChartSummary.totalProfit = 0;
                    this.profitChartSummary.averageProfit = 0;
                    this.profit.xAxis.categories = [];
                    this.profit.series[0].data = [];
                    this.profit.series[1].data = [];

                    let totalPurchase = 0;

                    for (let index = 0; index < this.daysArray.length; index++) {
                        const arraySignalDate = this.daysArray[index];
                        let convertedSalesDate;;
                        let convertedPurchaseDate;

                        const salesDate = response.res1.find(x => {
                            convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedSalesDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedSalesDate) {
                            this.profit.xAxis.categories.push(arraySignalDate)
                            this.profit.series[0].data.push(0);
                        } else {
                            this.profitChartSummary.totalSale = this.profitChartSummary.totalSale + +salesDate.sa;
                            this.profit.xAxis.categories.push(arraySignalDate);
                            this.profit.series[0].data.push(+salesDate.sa);
                        }

                        const purchaseDate = response.res2.find(x => {
                            convertedPurchaseDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedPurchaseDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedPurchaseDate) {
                            this.profit.series[1].data.push(0);
                        } else {
                            totalPurchase = totalPurchase + +purchaseDate.pa
                            this.profit.series[1].data.push(+purchaseDate.pa)
                        }

                        const dayWiseSales = this.profit.series[0].data[index];
                        const dayWisePurchase =  this.profit.series[1].data[index];
                        this.profit.series[1].data[index] = dayWiseSales - dayWisePurchase;
                    }

                    this.profitChartSummary.totalProfit =   this.profitChartSummary.totalSale - totalPurchase;
                    this.profitChartSummary.averageProfit = this.profitChartSummary.totalProfit / this.daysArray.length;
                    this.profitChartSummary.averageSale = this.profitChartSummary.totalSale / this.daysArray.length;
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
        let convertedSalesDate;
        this.analysisService
            .saleChart({ startDate: this.startDate, endDate: this.endDate } as ISelectedDate
            )
            .subscribe(
                (response) => {
                    this.saleChart = response
                    for (let index = 0; index < this.saleChart.length; index++) {
                        const element = this.saleChart[index];
                        this.totalSaleInSaleChartWise = +this.totalSaleInSaleChartWise + +element.sales_amount;
                        this.totalQtyInSaleChartWise = +this.totalQtyInSaleChartWise + +element.sales_qty;
                        this.averageSaleInSaleChartWise = (this.totalSaleInSaleChartWise / 30)
                        this.averageQtyInSaleChartWise = (this.totalQtyInSaleChartWise / 30)
                    }
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
        let convertedSalesDate;
        this.analysisService
            .purchaseChart({ startDate: this.startDate, endDate: this.endDate } as ISelectedDate
            )
            .subscribe(
                (response) => {
                    this.purchaseChart = response;
                    this.totalPurchaseInPurchaseChartWise = 0;
                    this.totalQtyInPurchaseChartWise = 0;
                    this.averagePurchaseInPurchaseChartWise = 0;
                    this.averageQtyInPurchaseChartWise = 0;
                    //    while( this.purchase.series.length > 0) {
                    //        this.purchase.series[0].remove(true);
                    //     }
                    //     while( this.purchase.xAxis.categories.length > 0) {
                    //         this.purchase.xAxis.categories.remove(true);
                    //      }
                    //     Highcharts.chart('purchaseChartData', this.purchase);
                    for (let index = 0; index < this.purchaseChart.length; index++) {
                        const element = this.purchaseChart[index];
                        this.totalPurchaseInPurchaseChartWise = +this.totalPurchaseInPurchaseChartWise + +element.purchase_amount;
                        this.totalQtyInPurchaseChartWise = +this.totalQtyInPurchaseChartWise + +element.purchase_qty;
                        this.averagePurchaseInPurchaseChartWise = (this.totalPurchaseInPurchaseChartWise / 30);
                        this.averageQtyInPurchaseChartWise = (this.totalQtyInPurchaseChartWise / 30);
                    }
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
        this.daysArray = [];
        for (var arr = [], dt = new Date(startDate); dt <= new Date(endDate); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            this.formatChangeDate = moment(element).format("DD-MM-YYYY");
            this.daysArray.push(this.formatChangeDate)
        }
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
