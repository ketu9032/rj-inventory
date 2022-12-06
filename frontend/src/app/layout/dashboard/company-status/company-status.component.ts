import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ItemsService } from '../../items/services/items.service';
import { CategoriesService } from '../../expense/services/categories.service';
import { SalesService } from '../../sales/services/sales.service';
import { DashboardService } from '../services/dashboard.service';

@Component({
    selector: 'app-company-status',
    templateUrl: './company-status.component.html',
    styleUrls: ['./company-status.component.scss']
})
export class CompanyStatusComponent implements OnInit {
    customer: number = 0;
    supplier: any = 0;
    product: number = 0;
    companyBalance: number = 0;
    stock: number = 0;
    userBalance: number = 0;
    totalBalance: number = 0;
    customersDue: number = 0;
    suppliersDue: number = 0;

    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        public snackBar: MatSnackBar,
        private salesService: SalesService,
        private dashboardService: DashboardService
    ) { }

    ngOnInit(): void {
        this.getCustomerDropDown();
        this.getSuppliersDropDown();
        this.getItemDropDown();
        this.getCompanyBalance();
    }

    getCustomerDropDown() {
        this.salesService
            .getCustomerDropDown()
            .subscribe(
                (response) => {
                    this.customer = response.length;
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
        let suppliers
        this.itemsService
            .getSupplierDropDown()
            .subscribe(
                (response) => {
                    suppliers = response;
                    this.supplier = suppliers.length

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
                    this.product = response.length;
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

    getCompanyBalance() {
        this.dashboardService
            .companyBalance()
            .subscribe(
                (response) => {
                    this.userBalance = response.res1[0].user_balance;
                    this.customersDue = response.res2[0].cdf_remaining_balance;
                    this.stock = response.res3[0].sales_stock;
                    this.suppliersDue = response.res4[0].supplier_due;

                    this.totalBalance = (+this.userBalance + +this.customersDue + +this.stock) - +this.suppliersDue;
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
