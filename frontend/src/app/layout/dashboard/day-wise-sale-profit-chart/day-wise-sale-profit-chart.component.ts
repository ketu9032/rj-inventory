import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Highcharts from 'highcharts';
import { IProfitChartFilter } from 'src/app/models/table';
import * as moment from 'moment';
import { ItemsService } from '../../items/services/items.service';
import { CategoriesService } from '../../expense/services/categories.service';
import { SalesService } from '../../sales/services/sales.service';
import { AnalysisService } from '../../analysis/services/analysis.service';

@Component({
    selector: 'app-day-wise-sale-profit-chart',
    templateUrl: './day-wise-sale-profit-chart.component.html',
    styleUrls: ['./day-wise-sale-profit-chart.component.scss']
})
export class DayWiseSaleProfitChartComponent implements OnInit {
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

    public dayWise: any = {
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

    dayWiseChartSummary = {
        totalSale: 0,
        totalProfit: 0,
        averageSale: 0,
        averageProfit: 0
    };

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private analysisService: AnalysisService
    ) { }

    ngOnInit(): void { }

    getDayWiseChart() {
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

        let dayWiseProfitChartFilter: IProfitChartFilter = {
            startDate: moment(this.startDate).format("YYYY-MM-DD"),
            endDate: moment(this.endDate).format("YYYY-MM-DD"),
            // categories: selectedCategories,
            // suppliers: selectedSuppliers,
            // items: selectedItems,
            // customers: selectedCustomers,
        }
        this.analysisService
            .profitChart(
                dayWiseProfitChartFilter

            )
            .subscribe(
                (response: { res1: any[], res2: any[] }) => {
                    this.dayWiseChartSummary.totalSale = 0;
                    this.dayWiseChartSummary.averageSale = 0;
                    this.dayWiseChartSummary.totalProfit = 0;
                    this.dayWiseChartSummary.averageProfit = 0;
                    this.dayWise.xAxis.categories = [];
                    this.dayWise.series[0].data = [];
                    this.dayWise.series[1].data = [];

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
                            this.dayWise.xAxis.categories.push(arraySignalDate)
                            this.dayWise.series[0].data.push(0);
                        } else {
                            this.dayWiseChartSummary.totalSale = this.dayWiseChartSummary.totalSale + +salesDate.sa;
                            this.dayWise.xAxis.categories.push(arraySignalDate);
                            this.dayWise.series[0].data.push(+salesDate.sa);
                        }

                        const purchaseDate = response.res2.find(x => {
                            convertedPurchaseDate = moment(x.date).subtract(1).format("DD-MM-YYYY")
                            return convertedPurchaseDate === arraySignalDate;
                        })
                        if (arraySignalDate !== convertedPurchaseDate) {
                            this.dayWise.series[1].data.push(0);
                        } else {
                            totalPurchase = totalPurchase + +purchaseDate.pa
                            this.dayWise.series[1].data.push(+purchaseDate.pa)
                        }

                        const dayWiseSales = this.dayWise.series[0].data[index];
                        const dayWisePurchase = this.dayWise.series[1].data[index];
                        this.dayWise.series[1].data[index] = dayWiseSales - dayWisePurchase;
                    }

                    this.dayWiseChartSummary.totalProfit = this.dayWiseChartSummary.totalSale - totalPurchase;
                    this.dayWiseChartSummary.averageProfit = this.dayWiseChartSummary.totalProfit / this.daysArray.length;
                    this.dayWiseChartSummary.averageSale = this.dayWiseChartSummary.totalSale / this.daysArray.length;
                    Highcharts.chart('dayWiseChartData', this.dayWise);
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
