import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ICdfData } from 'src/app/models/cdf';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { AddCdfComponent } from '../add-cdf/add-cdf.component';
import { CdfService } from '../services/cdf.service';
@Component({
    selector: 'app-active-cdf',
    templateUrl: './active-cdf.component.html',
    styleUrls: ['./active-cdf.component.scss']
})
export class activeCdfComponent implements OnInit {
    displayedColumns: string[] = [
        'email',
        'name',
        'company',
        'reference',
        'brands',
        'display_names',
        'platforms',
        'address',
        'mobile',
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
        private cdfService: CdfService,
        public snackBar: MatSnackBar
    ) { }
    ngOnInit(): void {
        this.getCdf();
    }
    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getCdf();
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    getCdf() {
        this.loader = true;
        this.cdfService.getCdf(this.tableParams).subscribe(
            (newCdf: any[]) => {
                this.dataSource = new MatTableDataSource<ICdfData>(newCdf);
                if (newCdf.length > 0) {
                    this.totalRows = newCdf[0].total;
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
    onAddNewCdf(): void {
        this.dialog
            .open(AddCdfComponent, {
                width: '600px',
                height: '600px'
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getCdf();
                }
            });
    }
    // onEditNewCdf(element) {
    //     this.dialog
    //         .open(AddCdfComponent, {
    //             width: '600px',
    //             height: '600px',
    //             data: element
    //         })
    //         .afterClosed()
    //         .subscribe((result) => {
    //             if (result) {
    //                 this.getCdf();
    //             }
    //         });
    // }
    changeStatus(id: number): void {
        this.cdfService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Cdf active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Cdf de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getCdf();
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
        this.getCdf();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getCdf();
    }
}
