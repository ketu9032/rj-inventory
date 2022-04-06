import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IExpenseData } from 'src/app/models/expense';
import { UserService } from '../../user/services/user.service';

@Component({
    selector: 'app-create-quotation',
    templateUrl: './create-quotation.component.html',
    styleUrls: ['./create-quotation.component.scss']
})
export class CreateQuotationComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string
    users = []
    categories = []
    isShowLoader = false;
    displayedColumns: string[] = [
        'item_name',
        'qty',
        'edit_delete',
        'price',
        'total'
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IExpenseData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateQuotationComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private router: Router,
        private userService: UserService,
    ) { }

    ngOnInit() {
        this.initializeForm();
        this.getUserDropDown()
        if (this.data && this.data.id) {
            this.fillForm();
        }
    }

    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            tier: [''],
            date: [''],
            invoice_number: [''],
            ref_number: [''],
            item_name: [''],
            hashtag: [''],
            qty: [''],
            available: [''],
            selling_price: [''],
            total: [''],


        });
    }

    // saveExpense(): void {
    //     const { user: userId, description, amount, date } = this.formGroup.value;
    //     this.isShowLoader = true;
    //     this.expenseService
    //         .addExpense({
    //             userId, description, amount, date
    //         })
    //         .subscribe(
    //             (response) => {
    //                 this.snackBar.open('Expense saved successfully', 'OK', {
    //                     duration: 3000
    //                 });
    //                 this.isShowLoader = false;
    //                 this.dialogRef.close(true);
    //             },
    //             (error) => {
    //                 this.isShowLoader = false;
    //                 this.snackBar.open(
    //                     (error.error && error.error.message) || error.message,
    //                     'Ok', {
    //                     duration: 3000
    //                 }
    //                 );
    //             },
    //             () => { }
    //         );
    // }

    // updateExpense(): void {
    //     const { user: userId, description, amount, date } = this.formGroup.value;
    //     this.isShowLoader = true;
    //     this.expenseService
    //         .editExpense({
    //             id: this.data.id,
    //             userId, description, amount, date
    //         })
    //         .subscribe(
    //             (response) => {
    //                 this.isShowLoader = false;
    //                 this.snackBar.open('Expense updated successfully', 'OK', {
    //                     duration: 3000
    //                 });
    //                 this.dialogRef.close(true);
    //             },
    //             (error) => {
    //                 this.isShowLoader = false;
    //                 this.snackBar.open(
    //                     (error.error && error.error.message) || error.message,
    //                     'Ok', {
    //                     duration: 3000
    //                 }
    //                 );
    //             },
    //             () => { }
    //         );
    // }

    onSubmit() {
        if (this.data && this.data.id) {
            //   this.updateExpense();
        } else {
            // this.saveExpense();
        }
    }

    fillForm() {
        const { user_id: userId, description: description, amount: amount, date: date } = this.data;
        this.formGroup.patchValue({
            description,
            amount,
            user: userId,
            date: date
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
    // getCategoryDropDown(type: string) {
    //     this.categoriesService
    //         .getCategoryDropDown(type)
    //         .subscribe(
    //             (response) => {
    //                 this.categories = response
    //             },
    //             (error) => {
    //                 this.snackBar.open(
    //                     (error.error && error.error.message) || error.message,
    //                     'Ok', {
    //                     duration: 3000
    //                 }
    //                 );
    //             },
    //             () => { }
    //         );

    // }
}
