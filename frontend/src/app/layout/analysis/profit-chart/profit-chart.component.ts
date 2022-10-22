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
import { IMatTableParams, ISelectedDate } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { IAnalysisData } from 'src/app/models/analysis';
import * as moment from 'moment';
import { ItemsService } from '../../items/services/items.service';
import { CategoriesService } from '../../expense/services/categories.service';
import { SalesService } from '../../sales/services/sales.service';
import { AnalysisService } from '../services/analysis.service';

@Component({
    selector: 'app-profit-chart',
    templateUrl: './profit-chart.component.html',
    styleUrls: ['./profit-chart.component.scss']
})
export class ProfitChartComponent implements OnInit {
    startDate = moment().add(-30, 'days').format("YYYY-MM-DD");
    endDate = moment().format("YYYY-MM-DD");
    daysArray = []
    profitChartSummary= {
        totalSale: 0,
        totalProfit: 0,
        averageSale: 0,
        averageProfit: 0
    };
    profit: any = {
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


    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        public snackBar: MatSnackBar,
        private categoriesService: CategoriesService,
        private salesService: SalesService,
        private analysisService: AnalysisService
    ) { }

    ngOnInit(): void {}


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
