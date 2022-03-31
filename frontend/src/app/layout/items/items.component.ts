import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICustomersData } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { CustomersService } from '../customers/services/customers.service';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemsCategoryComponent } from './cateogry/items-category.component';
import { ItemsCategoriesService } from './services/items-categories.service';
import { ItemsService } from './services/items.service';

@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
    displayedColumns: string[] = [
        'item_code',
        'item_name',
        'int_qty',
        'purchased',
        'sold',
        'available',
        'silver',
        'total',
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
        active: true
    }


    constructor(
        public dialog: MatDialog,
        private itemsService: ItemsService,
        public snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.getItems();
    }



    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getItems();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getItems() {
      this.loader = true;
      this.itemsService.getItems(this.tableParams).subscribe(
        (newCustomers: any[]) => {
          this.dataSource = new MatTableDataSource<ICustomersData>(newCustomers);
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

    onAddNewItem(): void {
        this.dialog
            .open(AddItemComponent, {
                width: '770px',
                height: '550px'
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getItems();
                }
            });
    }

    onEditNewItem(element) {
      this.dialog
        .open(AddItemComponent, {
            width: '1000px',
            height: '500px',
          data: element
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.getItems();
          }
        });
    }



    openItemsCategory() {
        this.dialog
            .open(ItemsCategoryComponent, {
                width: 'auto',
                height: '550px'
            })
            .afterClosed()
            .subscribe((result) => { });
    }
    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getItems();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
         this.getItems();
    }
    changeStatus(id: number): void {
        this.itemsService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Item active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Item de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getItems()
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

}
