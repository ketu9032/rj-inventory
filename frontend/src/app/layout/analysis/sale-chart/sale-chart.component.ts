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
import { IMatTableParams, ISaleChartFilter, ISelectedDate } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { IAnalysisData } from 'src/app/models/analysis';
import * as moment from 'moment';
import { ItemsService } from '../../items/services/items.service';
import { CategoriesService } from '../../expense/services/categories.service';
import { SalesService } from '../../sales/services/sales.service';
import { AnalysisService } from '../services/analysis.service';

@Component({
    selector: 'app-sale-chart',
    templateUrl: './sale-chart.component.html',
    styleUrls: ['./sale-chart.component.scss']
})
export class SaleChartComponent implements OnInit {
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

    saleChartSummary = {
        totalSale: 0,
        averageSale: 0,
        totalQty: 0,
        averageQty: 0
    };

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private analysisService: AnalysisService
    ) { }

    ngOnInit(): void { }

    getSaleChart() {
        this.loader = true;
        this.getDaysArray(this.startDate, this.endDate);
        // const selectedCategories = ((this.category.selected) as MatOption[]).map((x: MatOption)=>{
        //     return x.value;
        // });
        // const selectedSuppliers= ((this.supplier.selected) as MatOption[]).map((x: MatOption)=>{
        //     return x.value;
        // });
        // const selectedItems= ((this.item.selected) as MatOption[]).map((x: MatOption)=>{
        //     return x.value;
        // });
        // const selectedCustomers= ((this.customer.selected) as MatOption[]).map((x: MatOption)=>{
        //     return x.value;
        // });

        let saleChartFilter: ISaleChartFilter = {
            startDate: moment(this.startDate).format("YYYY-MM-DD"),
            endDate: moment(this.endDate).format("YYYY-MM-DD"),
            // categories: selectedCategories,
            // suppliers: selectedSuppliers,
            // items: selectedItems,
            // customers: selectedCustomers,
        }
        this.analysisService
            .saleChart(
                saleChartFilter
            )
            .subscribe(
                (response: any[]) => {
                    this.saleChartSummary.totalSale = 0;
                    this.saleChartSummary.averageSale = 0;
                    this.saleChartSummary.totalQty = 0;
                    this.saleChartSummary.averageQty = 0;
                    this.sale.xAxis.categories = [];
                    this.sale.series[0].data = [];
                    this.sale.series[1].data = [];
                    for (let index = 0; index < this.daysArray.length; index++) {
                        const arraySignalDate = this.daysArray[index];
                        let convertedSalesDate;;
                        const salesDate = response.find(x => {
                            convertedSalesDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedSalesDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedSalesDate) {
                            this.sale.xAxis.categories.push(arraySignalDate)
                            this.sale.series[0].data.push(0);
                            this.sale.series[1].data.push(0);
                        } else {
                            this.sale.xAxis.categories.push(arraySignalDate);
                            this.sale.series[0].data.push(+salesDate.sales_amount);
                            this.sale.series[1].data.push(+salesDate.sales_qty);
                            this.saleChartSummary.totalSale = this.saleChartSummary.totalSale + +salesDate.sales_amount;
                            this.saleChartSummary.totalQty = this.saleChartSummary.totalQty + +salesDate.sales_qty;
                            this.saleChartSummary.averageSale = +this.saleChartSummary.totalSale / +this.daysArray.length
                            this.saleChartSummary.averageQty = +this.saleChartSummary.totalQty / +this.daysArray.length
                        }
                    }
                    Highcharts.chart('saleChartData', this.sale);
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
