import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ISalesQuotationData } from 'src/app/models/sales-quotation';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { TiersService } from '../customers/services/tiers.service';
import { CreateQuotationComponent } from './create-quotation/create-quotation.component';
import { DeleteQuotationComponent } from './delete-quotation/delete-quotation.component';
import { MoveSalesComponent } from './move-sales/move-sales.component';
import { salesQuotationService } from './services/sales-quotation.service';
@Component({
    selector: 'app-sales-quotation',
    templateUrl: './sales-quotation.component.html',
    styleUrls: ['./sales-quotation.component.scss']
})
export class SalesQuotationComponent implements OnInit {
    displayedColumns: string[] = [
        'sr',
        'date',
        'remarks',
        'qty',
        'amount',
        'shipping',
        'gst',
        'total_due',
        'tier',
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
    selectTireLoader: boolean = false;
    totalRows: number;
    tireId?: number;
    isShow:boolean = false;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true,
        fromDate: '',
        toDate: '',
        tireId: ''

    }
    tires = [];
    fromDate: string;
    toDate: string;
    sr: number;
    totalQty: number = 0;
    total: number = 0;
    lastDue: number = 0;
    grandDueTotal: number;
    shipping: number;
    gst: number;
    totalDue: number;
    remarks: string;
    salesQuotationId: number;
    salesQuotationItems = [];
    date: string;

    constructor(
        public dialog: MatDialog,
        private salesQuotationService: salesQuotationService,
        private tiersService: TiersService,
        public snackBar: MatSnackBar,
    ) { }
    ngOnInit(): void {
        this.getTierDropDown()
        this.getSalesQuotation();
    }
    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getSalesQuotation();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    toggleCreateButton() {
        if (this.tireId ) {
            this.isShow = true
        } else {
            this.isShow = false
        }
    }
    getSalesQuotation() {
        this.loader = true;
        if (this.fromDate) {
            this.tableParams.fromDate = moment(this.fromDate).format('YYYY-MM-DD');
        }
        if (this.toDate) {
            this.tableParams.toDate = moment(this.toDate).format('YYYY-MM-DD');
        }
        if (this.tireId && this.tireId !== 0 ) {
            this.tableParams.tireId = this.tireId;
        } else {
            this.tableParams.tireId = '';

        }



        this.salesQuotationService.getSalesQuotation(this.tableParams).subscribe(
            (newCustomers: any[]) => {
                this.dataSource = new MatTableDataSource<ISalesQuotationData>(newCustomers);
                if (newCustomers.length > 0) {
                    this.totalRows = newCustomers[0].total;
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
    onAddNewCreateQuotation(): void {
        this.dialog
            .open(CreateQuotationComponent, {
                width: '1000px',
                height: '700px',
                data: {
                    tier_id: this.tireId
                }
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSalesQuotation();
                }
            });
    }
    onEditNewCustomers(element) {
        this.dialog
            .open(CreateQuotationComponent, {
                width: '1000px',
                height: '700px',
                data: element
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSalesQuotation();
                }
            });
    }
    onSelectCustomers(element) {
        this.dialog
            .open(MoveSalesComponent, {
                width: '400px',
                height: 'auto',
                data: element
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getSalesQuotation();
                }
            });
    }
    confirmDialog(id: string): void {
        this.dialog
            .open(DeleteQuotationComponent, {
                maxWidth: '400px',
                data: id
            })
            .afterClosed()
            .subscribe(() => {
                this.getSalesQuotation();

            });
    }
    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getSalesQuotation();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getSalesQuotation();
    }
    getTierDropDown() {
        this.selectTireLoader = true;
        this.tiersService
            .getTierDropDown()
            .subscribe(
                (response) => {
                    this.tires = response;
                    this.selectTireLoader = false;
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
        this.tireId = null;
        this.tableParams.search = '';
        this.tableParams.fromDate = '';
        this.tableParams.toDate = '';
        this.tableParams.tireId = '';
        this.getSalesQuotation();
    }
    getPrintData(id: number ) {
        this.salesQuotationId = id;
        this.salesQuotationPrint();
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
    salesQuotationPrint() {
        this.salesQuotationItems = [];
        this.loader = true;
        this.totalQty = 0
        this.total = 0;
        this.salesQuotationService.salesQuotationPrint(this.salesQuotationId)
            .subscribe(
                (response) => {
                    this.loader = false;
                    this.salesQuotationItems = response;
                    this.sr = this.salesQuotationItems[0].sr;
                    this.date = this.salesQuotationItems[0].date;
                    this.shipping = this.salesQuotationItems[0].shipping;
                    this.gst = this.salesQuotationItems[0].gst;
                    this.remarks = this.salesQuotationItems[0].remarks;
                    this.lastDue = this.salesQuotationItems[0].past_due;
                    this.salesQuotationItems.forEach(salesQuotationItems => {
                        this.totalQty = +this.totalQty + +salesQuotationItems.sales_quotation_details_qty;
                        this.total = +this.total + (+salesQuotationItems.sales_quotation_details_qty * +salesQuotationItems.sales_quotation_details_selling_price);
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
