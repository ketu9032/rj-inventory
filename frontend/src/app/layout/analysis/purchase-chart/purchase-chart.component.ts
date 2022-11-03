import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import * as Highcharts from 'highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { IMatTableParams, IPurchaseChartFilter, ISelectedDate } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { IAnalysisData } from 'src/app/models/analysis';
import * as moment from 'moment';
import { ItemsService } from '../../items/services/items.service';
import { CategoriesService } from '../../expense/services/categories.service';
import { SalesService } from '../../sales/services/sales.service';
import { AnalysisService } from '../services/analysis.service';

@Component({
    selector: 'app-purchase-chart',
    templateUrl: './purchase-chart.component.html',
    styleUrls: ['./purchase-chart.component.scss']
})
export class PurchaseChartComponent implements OnInit {
    startDate = moment().add(-30, 'days').format("YYYY-MM-DD");
    endDate = moment().format("YYYY-MM-DD");
    daysArray = []
    loader: boolean = false;

    @Input() categories = []
    @Input() suppliers = []
    @Input() items = []
    @Input() customers = []

    @ViewChild('category') category: MatSelect;
    allSelectedCategories: boolean = false;

    @ViewChild('supplier') supplier: MatSelect;
    allSelectedSuppliers: boolean = false;

    @ViewChild('item') item: MatSelect;
    allSelectedItems: boolean = false;

    @ViewChild('customer') customer: MatSelect;
    allSelectedCustomers: boolean = false;

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

    purchaseChartSummary = {
        totalPurchase: 0,
        totalQty: 0,
        averagePurchase: 0,
        averageQty: 0
    };

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private analysisService: AnalysisService
    ) { }
    ngOnInit(): void { }

    getPurchaseChart() {
        this.loader = true;
        this.getDaysArray(this.startDate, this.endDate);

        let saleChartFilter: IPurchaseChartFilter = {
            startDate: moment(this.startDate).format("YYYY-MM-DD"),
            endDate: moment(this.endDate).format("YYYY-MM-DD"),
            // categories: selectedCategories,
            // suppliers: selectedSuppliers,
            // items: selectedItems,
            // customers: selectedCustomers,
        }
        this.analysisService
            .purchaseChart(
                saleChartFilter
            )
            .subscribe(

                (response: any) => {
                    this.purchaseChartSummary.totalPurchase = 0;
                    this.purchaseChartSummary.totalQty = 0;
                    this.purchaseChartSummary.averagePurchase = 0;
                    this.purchaseChartSummary.averageQty = 0;
                    this.purchase.xAxis.categories = [];
                    this.purchase.series[0].data = [];
                    this.purchase.series[1].data = [];

                    for (let index = 0; index < this.daysArray.length; index++) {
                        const arraySignalDate = this.daysArray[index];
                        let convertedSalesDate;;
                        const purchaseDate = response.find(x => {
                            convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedSalesDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedSalesDate) {
                            this.purchase.xAxis.categories.push(arraySignalDate)
                            this.purchase.series[0].data.push(0);
                            this.purchase.series[1].data.push(0);
                        } else {
                            this.purchase.xAxis.categories.push(arraySignalDate);
                            this.purchase.series[0].data.push(+purchaseDate.purchase_amount);
                            this.purchase.series[1].data.push(+purchaseDate.purchase_qty);
                            this.purchaseChartSummary.totalPurchase= this.purchaseChartSummary.totalPurchase+ +purchaseDate.sales_amount;
                            this.purchaseChartSummary.totalQty = this.purchaseChartSummary.totalQty + +purchaseDate.purchase_qty;
                            this.purchaseChartSummary.averagePurchase= +this.purchaseChartSummary.totalPurchase/ +this.daysArray.length
                            this.purchaseChartSummary.averageQty = +this.purchaseChartSummary.totalQty / +this.daysArray.length
                        }
                    }
                    Highcharts.chart('purchaseChartData', this.purchase);

this.loader = false;
                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );
                },
                () => {

                }
            );


    }

    getDaysArray(startDate, endDate) {
        this.daysArray = [];
        for (var arr = [], dt = new Date(startDate); dt <= new Date(endDate); dt.setDate(dt.getDate() + 1)) {
            arr.push(new Date(dt));
        }
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            const formatChangeDate = moment(element).format("DD-MM-YYYY");
            this.daysArray.push(formatChangeDate)
        }
    };

    toggleAllSelectionByCategories() {
        if (this.allSelectedCategories) {
            this.category.options.forEach((item: MatOption) => item.select());
        } else {
            this.category.options.forEach((item: MatOption) => item.deselect());
        }
    }

    optionClickCategories() {
        let newStatus = true;
        this.category.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedCategories = newStatus;
    }

    toggleAllSelectionBySuppliers() {
        if (this.allSelectedSuppliers) {
            this.supplier.options.forEach((item: MatOption) => item.select());
        } else {
            this.supplier.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickSuppliers() {
        let newStatus = true;
        this.supplier.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedSuppliers = newStatus;
    }

    toggleAllSelectionByItems() {
        if (this.allSelectedItems) {
            this.item.options.forEach((item: MatOption) => item.select());
        } else {
            this.item.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickItems() {
        let newStatus = true;
        this.item.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedSuppliers = newStatus;
    }

    toggleAllSelectionByCustomers() {
        if (this.allSelectedCustomers) {
            this.customer.options.forEach((item: MatOption) => item.select());
        } else {
            this.customer.options.forEach((item: MatOption) => item.deselect());
        }
    }
    optionClickCustomers() {
        let newStatus = true;
        this.customer.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false;
            }
        });
        this.allSelectedCustomers = newStatus;
    }

}
