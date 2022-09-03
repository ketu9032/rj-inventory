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
import { ItemsService } from '../items/services/items.service';
import { AddSalesComponent } from './add-sales/add-sales.component';
import { PrintComponent } from './print/print.component';
import { SalesService } from './services/sales.service';
@Component({
    selector: 'app-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
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
    dataSource: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public defaultPageSize = PAGE_SIZE;
    public pageSizeOptions = PAGE_SIZE_OPTION;
    @ViewChild(MatSort) sort: MatSort;
    loader: boolean = false;
    selectCustomerLoader: boolean = false;
    isShow: boolean = false;
    totalRows: number;
    customerId: number;
    customers = [];
    loggedInUsersData: any;
    payment: number = 0;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 's.id',
        direction: "desc",
        search: '',
        active: true
    }
    customer;
    currentDate = new Date();
    date
    constructor(
        public dialog: MatDialog,
        private salesService: SalesService,
        public snackBar: MatSnackBar,
        public authService: AuthService
    ) { }
    ngOnInit(): void {
        this.date = moment(this.currentDate).format('YYYY-MM-DD');
        this.getCustomerDropDown();
        this.getSales();
        this.loggedInUsersData = this.authService.getUserData();
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
        this.salesService.getSales(this.tableParams).subscribe(
            (newSales: any[]) => {
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
                 data: { customerId: this.customerId }

            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSales();
                }
            });
    }
    onEditNewCustomers(element) {
        this.dialog
            .open(AddSalesComponent, {
                width: '1000px',
                height: '800px',
                data: {customerId: element.customer_id, salesId: element.id}
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
            .changeStatus({ id: id, status: !this.tableParams.active })
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
        this.tableParams.active = !this.tableParams
            .active;
        this.tableParams.pageNumber = 1;
        this.getSales();

    }
    toggleCreateAddSalesButton() {
        this.isShow = false;
        if (this.customerId) {
            this.isShow = true
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

    paymentCount() {
        this.payment = this.customer.amount + this.customer.balance
    }

}
