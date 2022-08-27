import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IExpenseData } from 'src/app/models/expense';
import { UserService } from '../../user/services/user.service';
import { CategoriesService } from '../services/categories.service';
import { ExpenseService } from '../services/expense.service';

@Component({
    selector: 'app-add-expense',
    templateUrl: './add-expense.component.html',
    styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string
    users = []
    categories = []
    isShowLoader = false;
    amount = true
    currentDate = new Date()

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IExpenseData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddExpenseComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private router: Router,
        private expenseService: ExpenseService,
        private userService: UserService,
        private categoriesService: CategoriesService
    ) { }

    ngOnInit() {
        this.initializeForm();
        this.getUserDropDown()
        this.getCategoryDropDown('Expense')
        if (this.data && this.data.id) {
            this.fillForm();
        }
    }

    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            description: ['', Validators.required],
            categoryId: ['', Validators.required],
            amount: ['', Validators.required],
            isCashIn: [true]
        });
    }

    saveExpense(): void {
        const {description, amount, categoryId,  isCashIn} = this.formGroup.value;
        this.isShowLoader = true;
        this.expenseService
            .addExpense({
                description, amount, categoryId, isCashIn
            })
            .subscribe(
                (response) => {
                    this.snackBar.open('Expense saved successfully', 'OK', {
                        duration: 3000
                    });
                    this.isShowLoader = false;
                    this.dialogRef.close(true);
                },
                (error) => {
                    this.isShowLoader = false;
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

    updateExpense(): void {
        const { description, amount, categoryId, isCashIn} = this.formGroup.value;
        this.isShowLoader = true;
        this.expenseService
            .editExpense({
                id: this.data.id,
                description, amount, categoryId, isCashIn
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Expense updated successfully', 'OK', {
                        duration: 3000
                    });
                    this.dialogRef.close(true);
                },
                (error) => {
                    this.isShowLoader = false;
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

    onSubmit() {
        if (this.data && this.data.id) {
            this.updateExpense();
        } else {
            this.saveExpense();
        }
    }

    fillForm() {
        const { user_id: userId, description: description, amount: amount, date: date, category_id: categoryId } = this.data;
        this.formGroup.patchValue({
            description,
            amount,
            user: userId,
            date: date,
            category: categoryId
        });
    }

    getUserDropDown() {
        this.userService
            .getUserDropDown()
            .subscribe(
                (response) => {
                    this.users = response
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
}
