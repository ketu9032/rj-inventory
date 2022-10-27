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
    loader: boolean = false;
    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        public snackBar: MatSnackBar,
        private categoriesService: CategoriesService,
        private salesService: SalesService,
    ) { }
    ngOnInit(): void {
        this.getCategoryDropDown('Item');
        this.getSuppliersDropDown();
        this.getItemDropDown();
        this.getCustomerDropDown();
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

    getSuppliersDropDown() {

        this.itemsService
            .getSupplierDropDown()
            .subscribe(
                (response) => {
                    this.suppliers = response;

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

        this.salesService
            .getItemDropDown()
            .subscribe(
                (response) => {
                    this.items = response;
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
        this.salesService
            .getCustomerDropDown()
            .subscribe(
                (response) => {
                    this.customers = response;
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
