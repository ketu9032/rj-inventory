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
    selector: 'app-smart-purchase',
    templateUrl: './smart-purchase.component.html',
    styleUrls: ['./smart-purchase.component.scss']
})
export class SmartPurchaseComponent implements OnInit {
    thirtyDays: number = 20;
    fifteenDays: number = 30;
    sevenDays: number = 50;
    futureDays: number = 7;
    totalRows: number;
    dataSource: any = [];
    defaultPageSize = PAGE_SIZE;
    pageSizeOptions = PAGE_SIZE_OPTION;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
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

    @Input() categories = []
    @Input() suppliers = []
    @Input() items = []
    @ViewChild('category') category: MatSelect;
    allSelectedCategories: boolean = false;

    @ViewChild('supplier') supplier: MatSelect;
    allSelectedSuppliers: boolean = false;

    @ViewChild('item') item: MatSelect;
    allSelectedItems: boolean = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private analysisService: AnalysisService

    ) { }

    ngOnInit(): void {
        this.getAnalysis();
    }

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

    getPrediction(qty30Days, qty15Days, qty7Days) {
        return (+(+(+(qty30Days * this.thirtyDays) / 100) + +((qty15Days * this.fifteenDays) / 100) + +((qty7Days * 50) / 100)) / (30)) * this.futureDays;
    }
    getRequired(intQty, qty30Days, qty15Days, qty7Days) {
        return (+intQty * 100) / ((((+((+qty30Days * this.thirtyDays) / 100) + ((+qty15Days * this.fifteenDays) / 100) + ((+qty7Days * this.sevenDays) / 100)) / (30)) * this.futureDays) * this.futureDays)
    }

    getAnalysis() {

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
            },
            (error) => {
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
}
