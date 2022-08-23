import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
        'no',
        't',
        'date',
        'customer',
        'amount',
        'pd',
        'total',
        'payment',
        'td',
        'op',
        'user',
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
    totalRows: number;
    customerName: string;
    customers = [];
    isShow: boolean = true;
    user: any;
    payment: number = 0;
    allFiledCustomer = []
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    customer;
    constructor(
        public dialog: MatDialog,
        private salesService: SalesService,
        public snackBar: MatSnackBar,
        public authService: AuthService
    ) { }
    ngOnInit(): void {
        this.getCustomerDropDown();
        this.getSales();
        this.user = this.authService.getUserData();
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
                data: { customer: this.allFiledCustomer }

            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSales();
                }
            });
    }
    customerData(customer) {
        this.allFiledCustomer.push(customer)
        //      this.allFiledCustomer.push(this.customer)
    }
    onEditNewCustomers(element) {
        this.dialog
            .open(AddSalesComponent, {
                width: '1000px',
                height: '800px',
                data: element
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
        if (this.customerName
            === '') {
            this.isShow = true
        } else {
            this.isShow = false
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
                    console.log(this.customers);

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
    // find(element) {
    //     this.customer = this.customers.find(val => {
    //         return (val.id) === element
    //     })

    // }
    paymentCount() {
        this.payment = this.customer.amount + this.customer.balance
    }

}
