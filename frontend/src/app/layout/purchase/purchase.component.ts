import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { IPurchaseData } from 'src/app/models/purchase';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { SalesService } from '../sales/services/sales.service';
import { UserService } from '../user/services/user.service';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { PurchaseService } from './services/purchase.service';

@Component({
    selector: 'app-purchase',
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
    displayedColumns: string[] = [
        'no',
        'token',
        'date',
        'suppliers_company',
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
    selectUserLoader: boolean = false;
    selectSupplierLoader: boolean = false;
    isShowAddPurchase: boolean = true;
    totalRows: number;
    supplierName: string;
    user: any;
    payment: number = 0;
    selectSupplierId?: number;

    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true,
        fromDate: '',
        toDate: '',
        userId: '',
        selectSupplierId: ''
    }
    suppliers;
    fromDate: string;
    toDate: string;
    userData = [];
    userId?: number;
    sr: number;
    token: number;
    qty: number;
    item: string;
    price: number;
    amount: number;
    totalQty: number = 0;
    total: number = 0;
    lastDue: number = 0;
    grandDueTotal: number;
    other_payment: number;
    totalDue: number;
    remarks: string;
    userName: string;
    item_code: string;
    suppliers_company: string
    tier: string;
    selling_price: number;
    purchaseId: number;
    purchaseItems = [];
    date: string;


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
        if (this.fromDate) {
            this.tableParams.fromDate = moment(this.fromDate).format('YYYY-MM-DD');
        }
        if (this.toDate) {
            this.tableParams.toDate = moment(this.toDate).format('YYYY-MM-DD');
        }
        if (this.selectSupplierId && +this.selectSupplierId !== 0) {
            this.tableParams.selectSupplierId = this.selectSupplierId;
        }
        if (this.userId && +this.userId !== 0) {
            this.tableParams.userId = this.userId;
        }

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

    onEditNewPurchase(element) {
        this.dialog
            .open(AddPurchaseComponent, {
                width: '1000px',
                height: '800px',
                data: {
                    supplierId: element.suppliers_id,
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
        this.isShowAddPurchase = false;
        if (!this.selectSupplierId) {
            this.isShowAddPurchase = true;
        } else {
            this.isShowAddPurchase = false;
        }
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

    clearSearch() {
        this.fromDate = '';
        this.toDate = '';
        this.userId = null;
        this.selectSupplierId = null;
        this.isShowAddPurchase = false;
        this.tableParams.search = '';
        this.tableParams.fromDate = '';
        this.tableParams.toDate = '';
        this.tableParams.selectSupplierId = '';
        this.tableParams.userId = '';
        this.getPurchase();
    }

    getPrintData(id: number) {
        this.purchaseId = id;
        this.purchasePrint();
    }
    print() {
        let prtContent = document.getElementById("print");
        let WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        window.open();
    }
    purchasePrint() {
        this.purchaseItems = [];
        this.loader = true;
        this.totalQty = 0
        this.total = 0;
        this.purchaseService.purchasePrint(this.purchaseId)
            .subscribe(
                (response) => {

                    this.loader = false;
                    this.purchaseItems = response;
                    this.token = this.purchaseItems[0].token;
                    this.suppliers_company = this.purchaseItems[0].suppliers_company;
                    this.date = this.purchaseItems[0].date;
                    this.payment = this.purchaseItems[0].payment;
                    this.other_payment = this.purchaseItems[0].other_payment
                    this.userName = this.purchaseItems[0].user_name;
                    this.tier = this.purchaseItems[0].tier;
                    this.remarks = this.purchaseItems[0].remarks;
                    this.lastDue = this.purchaseItems[0].past_due;
                    this.purchaseItems.forEach(purchaseItems => {
                        this.totalQty = +this.totalQty + +purchaseItems.purchase_details_qty;
                        this.total = +this.total + (+purchaseItems.purchase_details_qty * +purchaseItems.purchase_details_selling_price);
                    })
                    setTimeout(() => {
                        this.print();
                    }, 0);
                },
                (error) => {
                    this.snackBar.open(error.error.message || error.message, 'Ok', {
                        duration: 3000
                    });
                },
                () => { }
            );
    }
}
