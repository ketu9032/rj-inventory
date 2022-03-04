import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMatTableParams } from 'src/app/models/table';
import { IUserData } from 'src/app/models/user';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { CustomersService } from './services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = [
    'user_name',
    'mobile_number',
    'opening_balance',
    'role',
    'permission',
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
  }

  constructor(
    public dialog: MatDialog,
    private customersService: CustomersService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  sortData(sort: Sort) {
    this.tableParams.orderBy = sort.active;
    this.tableParams.direction = sort.direction;
    this.tableParams.pageNumber = 1;
    this.getUser();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getUser() {
    this.loader = true;
    this.customersService.getUser(this.tableParams).subscribe(
      (newUser: any[]) => {
        this.dataSource = new MatTableDataSource<IUserData>(newUser);
        if (newUser.length > 0) {
          this.totalRows = newUser[0].total;
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

  onAddNewUser(): void {
    this.dialog
      .open(AddCustomersComponent, {
        width: '400px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getUser();
        }
      });
  }
  onEditNewUser(element) {
    this.dialog
      .open(AddCustomersComponent, {
        width: '400px',
        data: element
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getUser();
        }
      });
  }
  pageChanged(event: PageEvent) {
    this.tableParams.pageSize = event.pageSize;
    this.tableParams.pageNumber = event.pageIndex + 1;
    this.getUser();
  }

}
