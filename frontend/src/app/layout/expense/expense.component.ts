import { CategoryComponent } from './cateogry/category.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE, PAGE_SIZE_OPTION } from 'src/app/shared/global/table-config';
import { ExpenseService } from './services/expense.service';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { MatTableDataSource } from '@angular/material/table';
import { IExpenseData } from 'src/app/models/expense';
import * as moment from 'moment';
import { CategoriesService } from './services/categories.service';
import { UserService } from '../user/services/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
    cashes = [
        { text: 'Cash In', value: true },
        { text: 'Cash Out', value: false },
    ]
    displayedColumns: string[] = [
        'expenseId',
        'expenseDate',
        'description',
        'categoryName',
        'amount',
        'userName',
        'action',
        'isApproved'

    ];
    dataSource: any = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public defaultPageSize = PAGE_SIZE;
    public pageSizeOptions = PAGE_SIZE_OPTION;
    @ViewChild(MatSort) sort: MatSort;
    loader: boolean = false;
    loggedInUser: boolean = true;
    totalRows: number;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'expense.id',
        direction: "desc",
        search: '',
        active: true,
        fromDate: '',
        toDate: '',
        userId: '',
        categoryId: '',
        isCashIn: null
    }
    categories = []
    loggedInUsersData: any;
    userData = []
    fromDate: string;
    toDate: string;
    userId?: number;
    categoryId?: number;
    isCashIn?: boolean

    constructor(
        public dialog: MatDialog,
        private expenseService: ExpenseService,
        public snackBar: MatSnackBar,
        public authService: AuthService,
        private userService: UserService,
        private categoriesService: CategoriesService
    ) { }

    ngOnInit(): void {
        this.loggedInUsersData = this.authService.getUserData();
        this.getUserDropDown()
        this.getCategoryDropDown('Expense')
        this.getExpense()
    }

    sortData(sort: Sort) {
        if (sort.active === 'expenseId') {
            sort.active = 'expense.id';
        }
        if (sort.active === 'expenseDate') {
            sort.active = 'expense.date';
        }
        if (sort.active === 'categoryName') {
            sort.active = 'c.name';
        }
        if (sort.active === 'userName') {
            sort.active = 'u.user_name';
        }
        this.tableParams.orderBy = sort.active;
        this.tableParams.direction = sort.direction;
        this.tableParams.pageNumber = 1;
        this.getExpense();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    getExpense() {
        this.loader = true;
        if (this.userId && +this.userId !== 0) {
            this.tableParams.userId = this.userId;
        } else {
            this.tableParams.userId = '';
        }

        if (this.categoryId && +this.categoryId !== 0) {
            this.tableParams.categoryId = this.categoryId;
        }  else {
            this.tableParams.categoryId = '';
        }

        if (this.fromDate) {
            this.tableParams.fromDate = moment(this.fromDate).format('YYYY-MM-DD');
        }
        if (this.toDate) {
            this.tableParams.toDate = moment(this.toDate).format('YYYY-MM-DD');
        }
        this.tableParams.isCashIn = this.isCashIn;
        this.expenseService.getExpense(this.tableParams).subscribe(
            (newCustomers: any[]) => {
                this.dataSource = new MatTableDataSource<IExpenseData>(newCustomers);
                if (newCustomers.length > 0) {
                    this.totalRows = newCustomers[0].total;
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

    onAddNewExpense(): void {
        this.dialog
            .open(AddExpenseComponent, {
                width: '400px'
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getExpense();
                }
            });
    }

    onEditNewExpense(element) {
        this.dialog
            .open(AddExpenseComponent, {
                width: '400px',
                data: element
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.getExpense();
                }
            });
    }

    pageChanged(event: PageEvent) {
        this.tableParams.pageSize = event.pageSize;
        this.tableParams.pageNumber = event.pageIndex + 1;
        this.getExpense()
    }
    toggleType() {
        this.tableParams.active = !this.tableParams.active;
        this.tableParams.pageNumber = 1;
        this.getExpense()
    }

    openCategory() {
        this.dialog
            .open(CategoryComponent, {
                width: 'auto',
                height: '550px'
            })
            .afterClosed()
            .subscribe((result) => { });
    }

    changeStatus(expenseId: number): void {
        this.expenseService
            .changeStatus({ expenseId, status: !this.tableParams.active })
            .subscribe(
                (response) => {
                    if (!this.tableParams.active) {
                        this.snackBar.open('Expense active successfully', 'OK', {
                            duration: 3000
                        })
                    } else {
                        this.snackBar.open('Expense de-active successfully', 'OK', {
                            duration: 3000
                        })
                    }
                    this.getExpense()
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
    getUserDropDown() {
        this.userService
            .getUserDropDown(this.loggedInUser)
            .subscribe(
                (response) => {
                    this.userData = response
                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );
                },
                () => { }
            );
    }
    getCategoryDropDown(type: string) {
        this.categoriesService
            .getCategoryDropDown(type)
            .subscribe(
                (response) => {
                    this.categories = response
                },
                (error) => {
                    this.snackBar.open(
                        (error.error && error.error.message) || error.message,
                        'Ok', {
                        duration: 3000
                    }
                    );
                },
                () => { }
            );
    }
    onApproved(expenseId: number): void {
        this.expenseService
            .approved(expenseId)
            .subscribe(
                (response) => {
                    this.snackBar.open('Expense Approved successfully', 'OK', {
                        duration: 3000
                    })
                    this.getExpense();
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

    clearSearch() {
        this.fromDate = '';
        this.toDate = '';
        this.userId = null;
        this.categoryId = null;
        this.isCashIn = undefined;
        this.tableParams.search = '';
        this.tableParams.userId = '';
        this.tableParams.categoryId = '';
        this.tableParams.fromDate = '';
        this.tableParams.toDate = '';
        this.tableParams.isCashIn = undefined;
        this.getExpense();
    }
}
