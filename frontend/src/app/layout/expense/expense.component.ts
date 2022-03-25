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

@Component({
    selector: 'app-expense',
    templateUrl: './expense.component.html',
    styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
    displayedColumns: string[] = [
        'id',
        'date',
        'description',
        'code',
        'amount',
        'user_name',
        'action',
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
        private expenseService: ExpenseService,
        public snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.getExpense()
    }

    sortData(sort: Sort) {
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

    changeStatus(id: number): void {
        this.expenseService
            .changeStatus({ id: id, status: !this.tableParams.active })
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

}
