import { CategoriesService } from './../../services/categories.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITiersData } from 'src/app/models/tiers';

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string
    isShowLoader: boolean = false;
    isCategoryCodeExist: boolean = true;
    isCategoryNameExist: boolean = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ITiersData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddCategoryComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private categoriesService: CategoriesService,
    ) { }

    ngOnInit() {
        this.initializeForm();
        if (this.data && this.data.id) {
            this.fillForm();
        }
    }

    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required]
        });
    }

    saveCategory(): void {
        const { code, name } = this.formGroup.value;
        this.isShowLoader = true;
        this.categoriesService

            .addCategory({
                code,
                name,
                type: 'Expense'
            })
            .subscribe(
                (response) => {
                    this.snackBar.open('Category saved successfully', 'OK', {
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

    updateCategory(): void {
        const { code, name } = this.formGroup.value;
        this.isShowLoader = true;
        this.categoriesService
            .editCategory({
                id: this.data.id,
                code,
                name
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Category updated successfully', 'OK', {
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
            this.updateCategory();
        } else {
            this.saveCategory();
        }
    }

    fillForm() {
        const { code, name } = this.data;
        this.formGroup.patchValue({
            code, name
        });
    }
    onCheckCategoryCode() {
        this.categoriesService
            .onCheckCategoryCode({ code: this.formGroup.controls.code.value })
            .subscribe(
                (response: boolean) => {
                    this.isCategoryCodeExist = response
                })
    }
    onCheckCategoryName() {
        this.categoriesService
            .onCheckCategoryName({ name: this.formGroup.controls.name.value })
            .subscribe(
                (response: boolean) => {
                    this.isCategoryNameExist = response
                })
    }
}
