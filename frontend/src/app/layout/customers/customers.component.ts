import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ICdfData } from 'src/app/models/cdf';
import { ICustomersData } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { CdfService } from '../cdf/services/cdf.service';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { DeleteCustomersComponent } from './delete-customers/delete-customers.component';
import { CustomersService } from './services/customers.service';
import { TierComponent } from './tier/tier.component';
@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
    displayedColumns: string[] = [
        'company',
        'balance',
        'payment',
        'due_limit',
        'tier_code',
        'action'
    ];
    dataSource: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public defaultPageSize = PAGE_SIZE;
    public pageSizeOptions = PAGE_SIZE_OPTION;
    @ViewChild(MatSort) sort: MatSort;
    loader: boolean = false;
    totalRows: number;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true,
        toDate: '',
        userId: ''
    }
    fromDate: string;
    toDate: string;
    constructor(
        public dialog: MatDialog,
        private customersService: CustomersService,
        public snackBar: MatSnackBar,
        private cdfService: CdfService,
    ) { }
    ngOnInit(): void {
        this.getCdf();
    }
    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getCdf();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    getCdf() {
        this.loader = true;
        if (this.fromDate) {
            this.tableParams.fromDate = moment(this.fromDate).format('YYYY-MM-DD');
        }
        if (this.toDate) {
            this.tableParams.toDate = moment(this.toDate).format('YYYY-MM-DD');
        }
        this.tableParams.cdfStatus = 'Active'
        this.cdfService.getCdf(this.tableParams).subscribe(
            (newCdf: any[]) => {
                this.dataSource = new MatTableDataSource<ICdfData>(newCdf);
                if (newCdf.length > 0) {
                    this.totalRows = newCdf[0].total;
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
    onAddNewCustomers(): void {
        this.dialog
            .open(AddCustomersComponent, {
                width: '520px',
                height: '480px'
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getCdf();
                }
            });
    }
    // onEditNewCustomers(element) {
    //     this.dialog
    //         .open(AddCustomersComponent, {
    //             width: '520px',
    //             height: '480px',
    //             data: element
    //         })
    //         .afterClosed()
    //         .subscribe((result) => {
    //             if (result) {
    //                 this.getCustomers();
    //             }
    //         });
    // }
    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getCdf();
    }
    openTires() {
        this.dialog
            .open(TierComponent, {
                width: '450px',
                height: '600px'
            })
            .afterClosed()
            .subscribe((result) => { });
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getCdf();
    }
    changeStatus(id: number): void {
        this.customersService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Customers active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Customers de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getCdf();
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
    clearSearch() {
        this.fromDate = '';
        this.toDate = '';
        this.tableParams.search = '';
        this.tableParams.fromDate = '';
        this.tableParams.toDate = '';
        this.getCdf();
    }
}
