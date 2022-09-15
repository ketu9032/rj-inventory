import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ISuppliersData } from 'src/app/models/suppliers';
import { SuppliersService } from '../services/suppliers.service';
@Component({
    selector: 'app-add-suppliers',
    templateUrl: './add-suppliers.component.html',
    styleUrls: ['./add-suppliers.component.scss']
})
export class AddSuppliersComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string;
    users = [];
    isShowLoader: boolean = false;
    isSupplierCompanyExist: boolean = true;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ISuppliersData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddSuppliersComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private router: Router,
        private suppliersService: SuppliersService,
    ) { }
    ngOnInit() {
        this.initializeForm();
        if (this.data && this.data.id) {
            this.fillForm();
        }
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            company: ['', Validators.required],
            dueLimit: ['', Validators.required],
            balance: ['', Validators.required],
            other: ['', Validators.required],
        });
    }
    saveSuppliers(): void {
        const { company, dueLimit, balance, other } = this.formGroup.value;
        this.isShowLoader = true;
        this.suppliersService
            .addSuppliers({
                company,
                dueLimit,
                balance,
                other
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Suppliers saved successfully', 'OK', {
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
    updateSuppliers(): void {
        const { company, dueLimit: dueLimit, balance, other } = this.formGroup.value;
        this.isShowLoader = true;
        this.suppliersService
            .editSuppliers({
                id: this.data.id,
                company,
                dueLimit,
                balance,
                other
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Suppliers updated successfully', 'OK', {
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
            this.updateSuppliers();
        } else {
            this.saveSuppliers();
        }
    }
    fillForm() {
        const { company, due_limit: dueLimit, balance, other } = this.data;
        this.formGroup.patchValue({
            company,
            dueLimit,
            balance,
            other
        });
    }
    onSupplierCompanyExistCheck() {
        this.suppliersService
            .onCheckSupplierCompany({ company: this.formGroup.controls.company.value })
            .subscribe(
                (response: boolean) => {
                    this.isSupplierCompanyExist = response
                })
    }
}
