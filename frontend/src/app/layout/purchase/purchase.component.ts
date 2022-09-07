import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { IPurchaseData } from 'src/app/models/purchase';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { ItemsService } from '../items/services/items.service';
import { SalesService } from '../sales/services/sales.service';
import { UserService } from '../user/services/user.service';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { PrintComponent } from './print/print.component';
import { PurchaseService } from './services/purchase.service';

@Component({
    selector: 'app-purchase',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
    displayedColumns: string[] = [
        'no',
        't',
        'date',
        'supplier',
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
    selectSupplierLoader: boolean = false;
    isShowAddPurchase: boolean = true;
    totalRows: number;
    supplierName: string;
    customers = [];
    user: any;
    payment: number = 0;
    selectSupplierId: number;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    customer;
    suppliers;
    fromDate: string;
    toDate: string;
    userData = [];
    userId? : number;

    loggedInUsersData: any;
    constructor(
        public dialog: MatDialog,
        private salesService: SalesService,
        private purchaseService: PurchaseService,
        public snackBar: MatSnackBar,
        private userService: UserService,
        public authService: AuthService
    ) { }
    ngOnInit(): void {
       this.loggedInUsersData = this.authService.getUserData();
       this.getUserDropDown()
        this.getSuppliersDropDown()
        this.getPurchase();
    }
    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getPurchase();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    getPurchase() {
        this.loader = true;
        this.purchaseService.getPurchase(this.tableParams).subscribe(
            (newPurchase: any[]) => {
                this.dataSource = new MatTableDataSource<IPurchaseData>(newPurchase);
                if (newPurchase.length > 0) {
                    this.totalRows = newPurchase[0].total;
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
    onAddNewPurchase(): void {
        this.dialog
            .open(AddPurchaseComponent, {
                width: '1000px',
                height: '800px',
                data: { supplierId: this.selectSupplierId }
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getPurchase();
                }
            });
    }

    onEditNewCustomers(element) {
        this.dialog
            .open(AddPurchaseComponent, {
                width: '1000px',
                height: '800px',
                data: {
                    supplierId: element.supplier_id,
                    purchaseId: element.id,
                    pastDue: element.past_due
                }
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getPurchase();
                }
            });
    }
    changeStatus(id: number): void {
        this.purchaseService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Purchase active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Purchase de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getPurchase();
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
        this.getPurchase();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getPurchase();

    }
    toggleCreateAddPurchaseButton() {
        this.isShowAddPurchase = false
        if (!this.selectSupplierId) {
            this.isShowAddPurchase = true
        } else {
            this.isShowAddPurchase = false
        }
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
                    this.getPurchase();
                }
            });
    }


    getSuppliersDropDown() {
        this.selectSupplierLoader = true;
        this.purchaseService
            .getSupplierDropDown()
            .subscribe(
                (response) => {
                    this.suppliers = response;
                    this.selectSupplierLoader = false;
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
        this.userService
            .getUserDropDown()
            .subscribe(
                (response) => {
                    this.userData = response
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
