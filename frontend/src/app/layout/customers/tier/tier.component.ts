import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ICustomersData } from 'src/app/models/customers';
import { IMatTableParams } from 'src/app/models/table';
import { IUserData } from 'src/app/models/user';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { AddCustomersComponent } from '../add-customers/add-customers.component';
import { DeleteCustomersComponent } from '../delete-customers/delete-customers.component';
import { CustomersService } from '../services/customers.service';
import { TiersService } from '../services/tiers.service';
import { AddTierComponent } from './add-tier/add-tier.component';

@Component({
  selector: 'app-tier-customers',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements OnInit {
  displayedColumns: string[] = [
    'code',
    'name',
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
    private tiersService: TiersService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getTier();
  }

  sortData(sort: Sort) {
    this.tableParams.orderBy = sort.active;
    this.tableParams.direction = sort.direction;
    this.tableParams.pageNumber = 1;
    this.getTier();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTier() {
    this.loader = true;
    this.tiersService.getTiers(this.tableParams).subscribe(
      (newTier: any[]) => {
        this.dataSource = new MatTableDataSource<ICustomersData>(newTier);
        if (newTier.length > 0) {
          this.totalRows = newTier[0].total;
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

  onAddNewTier(): void {
    this.dialog
      .open(AddTierComponent, {
        width: '400px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getTier();
        }
      });
  }
  onEditNewTier(element) {
    this.dialog
      .open(AddTierComponent, {
        width: '400px',
        data: element
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getTier();
        }
      });
  }
  confirmDialog(id: string): void {
    this.dialog
      .open(DeleteCustomersComponent, {
        maxWidth: '400px',
        data: id
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.data === true) {
          this.getTier();
        }
      });
  }
  pageChanged(event: PageEvent) {
    this.tableParams.pageSize = event.pageSize;
    this.tableParams.pageNumber = event.pageIndex + 1;
    this.getTier();
  }
}
