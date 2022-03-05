import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { ICategoriesData } from './../../../models/categories';
import { CategoriesService } from './../services/categories.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMatTableParams } from 'src/app/models/table';
import {
  PAGE_SIZE,
  PAGE_SIZE_OPTION
} from 'src/app/shared/global/table-config';
import { AddCategoryComponent } from './add-category/add-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['code', 'name', 'action'];
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
    direction: 'desc',
    search: ''
  };

  constructor(
    public dialog: MatDialog,
    private categoriesService: CategoriesService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCategory();
  }

  sortData(sort: Sort) {
    this.tableParams.orderBy = sort.active;
    this.tableParams.direction = sort.direction;
    this.tableParams.pageNumber = 1;
    this.getCategory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getCategory() {
    this.loader = true;
    this.categoriesService.getCategory(this.tableParams).subscribe(
      (newTier: any[]) => {
        this.dataSource = new MatTableDataSource<ICategoriesData>(newTier);
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
      () => {}
    );
  }

  onAddCategory(): void {
    this.dialog
      .open(AddCategoryComponent, {
        width: '400px'
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getCategory();
        }
      });
  }
  onEditCategory(element) {
    this.dialog
      .open(AddCategoryComponent, {
        width: '600px',
        data: element
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getCategory();
        }
      });
  }
  confirmDialog(id: string): void {
    this.dialog
      .open(DeleteCategoryComponent, {
        maxWidth: '400px',
        data: id
      })
      .afterClosed()
      .subscribe((result) => {
        if (result && result.data === true) {
          this.getCategory();
        }
      });
  }
  pageChanged(event: PageEvent) {
    this.tableParams.pageSize = event.pageSize;
    this.tableParams.pageNumber = event.pageIndex + 1;
    this.getCategory();
  }
}
