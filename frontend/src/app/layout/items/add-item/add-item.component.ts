import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IItemData } from 'src/app/models/item';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ItemsCategoriesService } from '../services/items-categories.service';
import { ItemsService } from '../services/items.service';
@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
    displayedColumns: string[] = [
        'supplier_name',
        'supplier_qty',
        'supplier_rate',
        'action'
    ];
    formSupplier: FormGroup;
    formGroup: FormGroup;
    selectedRole: string
    tires = []
    isShowLoader = false;
    public defaultPageSize = PAGE_SIZE;
    categories = []
    supplier = []
    dataSource: any = [];
    suppliers = []
    supplierDataSource: any = [];
    totalRows: number;
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    supplierRate: string = "";
    supplierQty: string = "";
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IItemData,
        @Inject(MAT_DIALOG_DATA) public supplierData: IItemSupplierData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddItemComponent>,
        private formBuilder: FormBuilder,
        private itemsCategoriesService: ItemsCategoriesService,
        public snackBar: MatSnackBar,
        private router: Router,
        private itemsService: ItemsService
    ) { }
    ngOnInit() {
        this.initializeForm();
        this.initializeSupplierForm()
        this.getCategoriesDropDown('Item')
        if (this.data && this.data.id) {
            this.fillForm();
        }
        if (this.supplierData && this.supplierData.id) {
            this.supplierFillForm();
        }
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            item_code: ['', Validators.required],
            item_name: ['', Validators.required],
            category: ['', Validators.required],
            comment: ['', Validators.required],
            int_qty: ['', Validators.required],
            silver: ['', Validators.required],
            retail: ['', Validators.required],
            gold: ['', Validators.required],
            india_mart: ['', Validators.required],
            dealer: ['', Validators.required],
        });
    }
    initializeSupplierForm(): void {
        this.formSupplier = this.formBuilder.group({
            supplier_name: ['', Validators.required],
            supplier_qty: ['', Validators.required],
            supplier_rate: ['', Validators.required],
        });
    }
    saveItems(): void {
        const { item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer,
            category: categoryId, supplierId } = this.formGroup.value;
        this.isShowLoader = true;
        this.itemsService
            .addItems({
                item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer, suppliers: this.suppliers,
                categoryId, supplierId
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Item saved successfully', 'OK', {
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
    updateItems(): void {
        const { item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer, category: categoryId, supplierId } = this.formGroup.value;
        this.isShowLoader = true;
        this.itemsService
            .editItems({
                id: this.data.id, item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer, suppliers: this.suppliers, categoryId, supplierId
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Item updated successfully', 'OK', {
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
            this.updateItems();
        } else {
            this.saveItems();
        }
    }
    addSupplier() {
        this.suppliers.push(this.formSupplier.value)
        this.supplierDataSource = new MatTableDataSource<any>(this.suppliers);
    }
    fillForm() {
        const { item_code,
            item_name, comment, int_qty, silver, retail, gold, india_mart, dealer, category_id: categoryId, } = this.data;
        this.formGroup.patchValue({
            item_code,
            item_name, category: categoryId, comment, int_qty, silver, retail, gold, india_mart, dealer
        });
    }
    supplierFillForm() {
        const { item_id: itemId, supplier_name, supplier_qty, supplier_rate } = this.supplierData;
        this.formSupplier.patchValue({
            itemId, supplier_name, supplier_qty, supplier_rate
        });
    }
    getCategoriesDropDown(type: string) {
        this.itemsCategoriesService
            .getCategoriesDropDown(type)
            .subscribe(
                (response) => {
                    this.categories = response;
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
    getSupplierDropDown() {
        this.itemsService
            .getSupplierDropDown()
            .subscribe(
                (response) => {
                    this.supplier = response;
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
