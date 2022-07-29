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
import { ItemsSuppliersService } from '../services/items-supplier.service';
import { ItemsService } from '../services/items.service';
@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
    displayedColumns: string[] = [
        'supplier_name',
        'item_supplier_rate',
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
    suppliersCompany = [];
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
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddItemComponent>,
        private formBuilder: FormBuilder,
        private itemsCategoriesService: ItemsCategoriesService,
        public snackBar: MatSnackBar,
        private router: Router,
        private itemsService: ItemsService,
        private itemsSuppliersService: ItemsSuppliersService
    ) { }
    ngOnInit() {
        this.initializeForm();
        this.initializeSupplierForm()
        this.getCategoriesDropDown('Item')
        this.getSuppliersDropDown()
        if (this.data && this.data.id) {
            this.fillForm();
            this.getItemSupplier();
        }
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            item_code: ['', Validators.required],
            item_name: ['', Validators.required],
            category: ['', Validators.required],
            comment: [''],
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
            suppliers_id: ['', Validators.required],
            item_supplier_rate: ['', Validators.required],
        });
    }
    saveItems(): void {
        const { item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer,
            category: categoryId } = this.formGroup.value;
        this.isShowLoader = true;
        this.itemsService
            .addItems({
                item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer, suppliers: this.suppliers,
                categoryId
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
        const { item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer, category: categoryId } = this.formGroup.value;
        this.isShowLoader = true;
        this.itemsService
            .editItems({
                id: this.data.id, item_code, item_name, category, comment, int_qty, silver, retail, gold, india_mart, dealer, suppliers: this.suppliers, categoryId
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
        // this.clearSupplierForm();
    }
    addSupplier() {
        const {
            suppliers_id,
            item_supplier_rate,
        } = this.formSupplier.value
        const supplierName = this.suppliersCompany.find(x => +x.id === +suppliers_id).company;
        const supplier = {
            suppliers_id, item_supplier_rate, supplier_name: supplierName
        }
        this.suppliers.push(supplier)
        this.supplierDataSource = new MatTableDataSource<IItemSupplierData>(this.suppliers);
    }
    fillForm() {
        const { item_code,
            item_name, comment, int_qty, silver, retail, gold, india_mart, dealer, category_id: categoryId, } = this.data;
        this.formGroup.patchValue({
            item_code,
            item_name, category: categoryId, comment, int_qty, silver, retail, gold, india_mart, dealer
        });
    }
    supplierFillForm(suppliersId) {
        const itemSupplierRate = this.suppliers.find(x => +x.suppliers_id === +suppliersId).item_supplier_rate;
        this.formSupplier.patchValue({
            itemId: this.data.id, suppliers_id: suppliersId, item_supplier_rate: itemSupplierRate
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
    getSuppliersDropDown() {
        this.itemsSuppliersService
            .getItemSupplierDropDown()
            .subscribe(
                (response) => {
                    this.suppliersCompany = response;
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
    getItemSupplier() {
        this.supplierDataSource = [];
        this.suppliers = []
        this.tableParams.itemId = this.data.id;
        this.itemsSuppliersService.getItemSupplier(this.tableParams).subscribe(
            (newItemSupplier: any[]) => {
                this.suppliers.push(...newItemSupplier);
                this.supplierDataSource = new MatTableDataSource<IItemSupplierData>(newItemSupplier);
                if (newItemSupplier.length > 0) {
                    this.totalRows = newItemSupplier[0].total;
                }
            },
            (error) => {
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }
}
