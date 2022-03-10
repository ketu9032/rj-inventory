import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IUserData } from 'src/app/models/user';
import {
    PAGE_SIZE,
    PAGE_SIZE_OPTION
} from './../../shared/global/table-config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { UserService } from './services/user.service';
import { AddUserComponent } from './add-user/add-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { IMatTableParams } from 'src/app/models/table';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    displayedColumns: string[] = [
        'user_name',
        'mobile_number',
        'balance',
        'role',
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
        private userService: UserService,
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
        this.userService.getUser(this.tableParams).subscribe(
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
            .open(AddUserComponent, {
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
            .open(AddUserComponent, {
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
    //   confirmDialog(id: string): void {
    //     this.dialog
    //       .open(DeleteUserComponent, {
    //         maxWidth: '400px',
    //         data: id
    //       })
    //       .afterClosed()
    //       .subscribe((result) => {
    //         if (result && result.data === true) {
    //           this.getUser();
    //         }
    //       });
    //   }

    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getUser();
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.getUser();
    }

    changeStatus(id: number): void {
        this.userService
            .changeStatus({ id: id, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('User Active Successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('User DActive Successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getUser();
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
