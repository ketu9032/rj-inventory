import { ICategoriesData } from '../../../models/categories';
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
import { AddItemsCategoryComponent } from './add-items-category/add-items-category.component';
import { DeleteItemsCategoryComponent } from './delete-items-category/delete-items-category.component';
import { ItemsCategoriesService } from '../services/items-categories.service';

@Component({
    selector: 'app-items-category',
    templateUrl: './items-category.component.html',
    styleUrls: ['./items-category.component.scss']
})
export class ItemsCategoryComponent implements OnInit {
    displayedColumns: string[] = ['code', 'name', 'action'];
    dataSource: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public defaultPageSize = 5;
    public pageSizeOptions = PAGE_SIZE_OPTION;
    @ViewChild(MatSort) sort: MatSort;
    loader: boolean = true;
    totalRows: number;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: 'desc',
        search: '',
        active: true,
        type: 'Item'
    };

    constructor(
        public dialog: MatDialog,
        private itemsCategoriesService: ItemsCategoriesService,
        public snackBar: MatSnackBar,
    ) { }

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
        this.itemsCategoriesService.getCategory(this.tableParams).subscribe(
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
            () => { }
        );
    }

    onAddCategory(): void {
        this.dialog
            .open(AddItemsCategoryComponent, {
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
            .open(AddItemsCategoryComponent, {
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
            .open(DeleteItemsCategoryComponent, {
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

    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getCategory();


    }
    changeStatus(id: number): void {
        this.itemsCategoriesService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Category active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Category de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getCategory();

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
