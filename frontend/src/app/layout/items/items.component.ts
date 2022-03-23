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
import { ItemsService } from './services/items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  displayedColumns: string[] = [

    'code',
    'name',
    'int_qty',
    'purchased',
    'sold',
    'available',
    'sliver_price',
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

  onAddNewItem(): void {
    this.dialog
      .open(AddItemComponent, {
        width: '500px',
        height: '500px'
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

  openItemsCategory() {
    this.dialog
      .open(ItemsCategoryComponent, {
        width: 'auto',
        height: '550px'
      })
      .afterClosed()
      .subscribe((result) => {});
  }
  pageChanged(event: PageEvent) {
    this.tableParams.pageSize = event.pageSize;
    this.tableParams.pageNumber = event.pageIndex + 1;
    //  this.getItems();
  }
  toggleType() {
    this.tableParams.active = !this.tableParams.active;
    // this.getItems();
  }
}
