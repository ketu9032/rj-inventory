import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IMatTableParams } from 'src/app/models/table';
import { ITransferData } from 'src/app/models/transfer';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { UserService } from '../user/services/user.service';
import { AddTransferComponent } from './add-transfer/add-transfer.component';
import { DeleteTransferComponent } from './delete-transfer/delete-transfer.component';
import { TransferService } from './services/transfer.service';

@Component({
    selector: 'app-transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
    displayedColumns: string[] = [
        'date',
        'description',
        'amount',
        'user_name',
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
        private transferService: TransferService,
        public snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.getTransfer();
    }

    sortData(sort: Sort) {
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getTransfer();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getTransfer() {
        this.loader = true;
        this.transferService.getTransfer(this.tableParams).subscribe(
            (newTransfer: any[]) => {
                this.dataSource = new MatTableDataSource<ITransferData>(newTransfer);
                if (newTransfer.length > 0) {
                    this.totalRows = newTransfer[0].total;
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
            .open(AddTransferComponent, {
                width: '400px'
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getTransfer();
                }
            });
    }
    onEditNewUser(element) {
        this.dialog
            .open(AddTransferComponent, {
                width: '400px',
                data: element
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getTransfer();
                }
            });
    }
    confirmDialog(id: string): void {
        this.dialog
            .open(DeleteTransferComponent, {
                maxWidth: '400px',
                data: id
            })
            .afterClosed()
            .subscribe((result) => {
                if (result && result.data === true) {
                    this.getTransfer();
                }
            });
    }

    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getTransfer();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getTransfer();
    }
    changeStatus(id: number): void {
        this.transferService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Transfer active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Transfer de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getTransfer();
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
