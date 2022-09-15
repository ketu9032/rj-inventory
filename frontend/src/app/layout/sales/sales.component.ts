import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { ISalesData } from 'src/app/models/sales';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { UserService } from '../user/services/user.service';
import { AddSalesComponent } from './add-sales/add-sales.component';
import { PrintComponent } from './print/print.component';
import { SalesService } from './services/sales.service';
@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
    pageSizeOptions = PAGE_SIZE_OPTION;
    defaultPageSize = PAGE_SIZE;
    totalRows: number;
    loader: boolean = false;
    selectCustomerLoader: boolean = false;
    selectUserLoader: boolean = false;
    isShowAddSales: boolean = false;
    selectedCustomerId: number;
    currentDate: string;
    customers = [];
    dataSource: any = [];
    userData = [];
    loggedInUsersData: any;
    displayedColumns: string[] = [
        'id',
        'token',
        'sales_date',
        'customer_name',
        'amount',
        'past_due',
        'total_amount',
        'payment',
        'total_due',
        'other_payment',
        'user_name',
        'action',
        'print'
    ];
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 's.id',
        direction: "desc",
        search: '',
        active: true,
        fromDate: '',
        toDate: '',
        userId: ''
    };
    fromDate: string;
    toDate: string;
    userId?: number;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(
        private dialog: MatDialog,
        private salesService: SalesService,
        private snackBar: MatSnackBar,
        private authService: AuthService,
        private userService: UserService
    ) { }
    ngOnInit(): void {
        this.currentDate = moment().format('YYYY-MM-DD');
        this.loggedInUsersData = this.authService.getUserData();
        this.getCustomerDropDown();
        this.getUserDropDown();
        this.getSales();

    }
    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getSales();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    getSales() {
        this.loader = true;
        if (this.userId && +this.userId !== 0) {
            this.tableParams.userId = this.userId;
        }
        if (this.fromDate) {
            this.tableParams.fromDate = moment(this.fromDate).format('YYYY-MM-DD');
        }
        if (this.toDate) {
            this.tableParams.toDate = moment(this.toDate).format('YYYY-MM-DD');
        }
        this.salesService.getSales(this.tableParams).subscribe(
            (newSales: any[]) => {
                this.totalRows = 0;
                this.dataSource = new MatTableDataSource<ISalesData>(newSales);
                if (newSales.length > 0) {
                    this.totalRows = newSales[0].total;
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
    onAddNewSales(): void {
        this.dialog
            .open(AddSalesComponent, {
                width: '1000px',
                height: '800px',
                data: { customerId: this.selectedCustomerId }
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSales();
                }
            });
    }
    onEditNewSales(element) {
        this.dialog
            .open(AddSalesComponent, {
                width: '1000px',
                height: '800px',
                data: {
                    customerId: element.customer_id,
                    salesId: element.id,
                    pastDue: element.past_due
                }
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSales();
                }
            });
    }
    changeStatus(id: number): void {
        this.salesService
            .changeStatus({ id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Sales active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Sales de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getSales()
                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok',
                        {
                            duration: 3000
                        }
                    );
                },
                () => { }
            );
    }
    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getSales();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getSales();
    }
    toggleCreateAddSalesButton() {
        this.isShowAddSales = false;
        if (this.selectedCustomerId) {
            this.isShowAddSales = true
        }
    }
    getCustomerDropDown() {
        this.selectCustomerLoader = true;
        this.salesService
            .getCustomerDropDown()
            .subscribe(
                (response) => {
                    this.customers = response;
                    this.selectCustomerLoader = false;
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

    getUserDropDown() {
        this.selectUserLoader = true;
        this.userService
            .getUserDropDown()
            .subscribe(
                (response) => {
                    this.userData = response;
                    this.selectUserLoader = false;
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

    print(element) {
        this.dialog
            .open(PrintComponent, {
                width: '1000px',
                height: 'auto',
                data: element
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSales();
                }
            });
    }
    clearSearch() {
        this.fromDate = '';
        this.toDate = '';
        this.userId = null;
        this.tableParams.search = '';
        this.tableParams.userId = '';
        this.tableParams.fromDate = '';
        this.tableParams.toDate = '';
        this.getSales();
    }
}
