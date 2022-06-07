import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ISalesData } from 'src/app/models/sales';
import { ISalesBillData } from 'src/app/models/sales_bill';
import { SalesService } from '../services/sales.service';
@Component({
    selector: 'app-add-sales',

    templateUrl: './add-sales.component.html',
    styleUrls: ['./add-sales.component.scss']
})
export class AddSalesComponent implements OnInit {
    formGroup: FormGroup;
    addSalesFormGroup: FormGroup;
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
    sales = [];
    customerCompany = [];
    salesDataSource: any = [];
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
            company: [''],
            date: [''],
            invoice_no: [''],
            ref_no: ['']
        });
    }
    initializeSalesForm(): void {
        this.addSalesFormGroup = this.formBuilder.group({
            item_code: [''],
            qty: [''],
            available: [''],
            selling_price: [''],
            total: ['']
        });
    }

    saveSales(): void {
        const {
            date,
            invoice_no,
            ref_no,
            company: companyId } = this.formGroup.value;
        this.isShowLoader = true;
        this.salesService
            .addSales({
                date,
                invoice_no,
                ref_no, sales: this.sales,
                companyId
            })
            .subscribe(
                (response) => {
                    this.snackBar.open('Sales saved successfully', 'OK', {
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

    addSupplier() {
        const {
            id,
            item_code,
            qty,
            available,
            selling_price,
            total
        } = this.addSalesFormGroup.value
        const customerName = this.customerCompany.find(x => +x.id === +id).customer;
        const sales = {
            id,
            item_code,
            qty,
            available,
            selling_price,
            total, supplier_name: customerName
        }
        this.sales.push(sales)
        this.salesDataSource = new MatTableDataSource<ISalesBillData>(this.sales);
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
