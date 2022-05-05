import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMatTableParams } from 'src/app/models/table';
import { ITiersData } from 'src/app/models/tiers';
import { PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { TiersService } from '../services/tiers.service';
import { AddTierComponent } from './add-tier/add-tier.component';
import { DeleteTierComponent } from './delete-tier/delete-tier.component';
@Component({
    selector: 'app-tier-customers',
    templateUrl: './tier.component.html',
    styleUrls: ['./tier.component.scss']
})
export class TierComponent implements OnInit {
    displayedColumns: string[] = [
        'code',
        'action'
    ];
    dataSource: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public defaultPageSize = 5;
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
                this.dataSource = new MatTableDataSource<ITiersData>(newTier);
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
                width: '350px'
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
                width: '350px',
                data: element
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getTier();
                }
            });
    }
    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getTier();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getTier();
    }
    changeStatus(id: number): void {
        this.tiersService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Customers active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Customers de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getTier();
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
