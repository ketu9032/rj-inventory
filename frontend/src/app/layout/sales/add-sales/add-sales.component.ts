import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ISalesData } from 'src/app/models/sales';
import { SalesService } from '../services/sales.service';
@Component({
    selector: 'app-add-sales',
    templateUrl: './add-sales.component.html',
    styleUrls: ['./add-sales.component.scss']
})
export class AddSalesComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string
    users = [];
    categories = [];
    items = [];
    qty;
    sellingPrice;
    total;
    isShowLoader = false;
    isChecked = true;
    totalQty;
    lastBillNo;
    currentDate = new Date();
    displayedColumns: string[] = [
        'item_name',
        'qty',
        'edit_delete',
        'price',
        'total'
    ];
    date1 = new FormControl(new Date())
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ISalesData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddSalesComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private router: Router,
        private salesService: SalesService,
    ) { }
    ngOnInit() {
        this.getItemDropDown();
        this.initializeForm();
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            invoice_number: [''],
            item_code: [''],
            hashtag: [''],
            qty: [''],
            available: [''],
            selling_price: [''],
            total: [''],
        });
    }
    saveSales(): void {
        const { item_code, qty, available, selling_price, total } = this.formGroup.value;
        this.isShowLoader = true;
        this.salesService
            .addSales({
                item_code, qty, available, selling_price, total
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
    onSubmit() {
        this.saveSales()
    }
    count() {
        if (this.formGroup.value.qty !== '') {
            this.total = (this.formGroup.value.qty * this.formGroup.value.selling_price)
            this.formGroup.patchValue({
                total: this.total
            })
        }
        console.log(this.total);
    }
    fillForm(itemId) {
        this.formGroup.patchValue({
            available: itemId.int_qty,
            selling_price: itemId.silver,
        });
    }
    getItemDropDown() {
        this.salesService
            .getItemDropDown()
            .subscribe(
                (response) => {
                    this.items = response
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
