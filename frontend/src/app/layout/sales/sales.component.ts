import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { ItemsService } from '../items/services/items.service';
import { AddSalesComponent } from './add-sales/add-sales.component';
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
    totalRows: number;
    customerName;
    customers = [];
    isShow: boolean = true;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }

    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        private salesService: SalesService,
        public snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.getItems();
        this.getCustomerDropDown();

    }

    getItems() { }

    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        // this.getItems();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    // getItems() {
    //   this.loader = true;
    //   this.itemsService.getItems(this.tableParams).subscribe(
    //     (newCustomers: any[]) => {
    //       this.dataSource = new MatTableDataSource<ICustomersData>(newCustomers);
    //       if (newCustomers.length > 0) {
    //         this.totalRows = newCustomers[0].total;
    //       }
    //       setTimeout(() => {
    //         this.paginator.pageIndex = this.tableParams.pageNumber - 1;
    //         this.paginator.length = +this.totalRows;
    //       });
    //       this.loader = false;
    //     },
    //     (error) => {
    //       this.loader = false;
    //       this.snackBar.open(error.error.message || error.message, 'Ok', {
    //         duration: 3000
    //       });
    //     },
    //     () => { }
    //   );
    // }

    onAddNewSales(): void {
      this.dialog
        .open(AddSalesComponent, {
            width: '1000px',
            height: '800px'
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.getItems();
          }
        });
    }

    // // onEditNewCustomers(element) {
    // //   this.dialog
    // //     .open(AddCustomersComponent, {
    // //       width: '400px',
    // //       data: element
    // //     })
    // //     .afterClosed()
    // //     .subscribe((result) => {
    // //       if (result) {
    // //         this.getItems();
    // //       }
    // //     });
    // // }

    // // confirmDialog(id: string): void {
    // //   this.dialog
    // //     .open(DeleteCustomersComponent, {
    // //       maxWidth: '400px',
    // //       data: id
    // //     })
    // //     .afterClosed()
    // //     .subscribe((result) => {
    // //       if (result && result.data === true) {
    // //         this.getItems();
    // //       }
    // //     });
    // // }

    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        //  this.getItems();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        // this.getItems();
    }

    toggleCreateAddSalesButton(){
        if(this.customerName
            === '' ){
                this.isShow = true
            }else {
                this.isShow = false

            }
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
