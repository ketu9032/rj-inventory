import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ISuppliersData } from 'src/app/models/suppliers';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { AddSuppliersComponent } from './add-suppliers/add-suppliers.component';
import { DeleteSuppliersComponent } from './delete-suppliers/delete-suppliers.component';
import { SuppliersService } from './services/suppliers.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  displayedColumns: string[] = [
    'company',
    'due_limit',
    'balance',
    'other',
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
    private suppliersService: SuppliersService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getSuppliers();
  }

  sortData(sort: Sort) {
    this.tableParams.orderBy = sort.active;
    this.tableParams.direction = sort.direction;
    this.tableParams.pageNumber = 1;
    this.getSuppliers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getSuppliers() {
    this.loader = true;
    this.suppliersService.getSuppliers(this.tableParams).subscribe(
      (newSuppliers: any[]) => {
        this.dataSource = new MatTableDataSource<ISuppliersData>(newSuppliers);
        if (newSuppliers.length > 0) {
          this.totalRows = newSuppliers[0].total;
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

  onAddNewSuppliers(): void {
    this.dialog
      .open( AddSuppliersComponent, {
        width: '400px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getSuppliers();
        }
      });
  }
  onEditNewSuppliers(element) {
    this.dialog
      .open( AddSuppliersComponent, {
        width: '400px',
        data: element
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getSuppliers();
        }
      });
  }
  confirmDialog(id: string): void {
    this.dialog
      .open(DeleteSuppliersComponent, {
        maxWidth: '400px',
        data: id
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.data === true) {
          this.getSuppliers();
        }
      });
  }

  pageChanged(event: PageEvent) {
    this.tableParams.pageSize = event.pageSize;
    this.tableParams.pageNumber = event.pageIndex + 1;
    this.getSuppliers();
  }
  toggleType() {
    this.tableParams.active = !this.tableParams.active;
    this.getSuppliers();
  }
}
