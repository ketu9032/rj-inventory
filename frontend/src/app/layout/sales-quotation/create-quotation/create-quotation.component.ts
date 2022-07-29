import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IItemData } from 'src/app/models/item';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { ISalesQuotationData } from 'src/app/models/sales-quotation';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ItemsCategoriesService } from '../../items/services/items-categories.service';
import { ItemsSuppliersService } from '../../items/services/items-supplier.service';
import { ItemsService } from '../../items/services/items.service';
import { salesQuotationService } from '../services/sales-quotation.service';



@Component({
    selector: 'app-create-quotation',
    templateUrl: './create-quotation.component.html',
    styleUrls: ['./create-quotation.component.scss']
})
export class CreateQuotationComponent implements OnInit {
    displayedColumns: string[] = [
        'item_code',
        'qty',
        'total',
        'action',
        'selling_price',
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
    totalQty: number;
    lastBillNo:number ;
    sales = []

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ISalesQuotationData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateQuotationComponent>,
        private formBuilder: FormBuilder,
        private itemsCategoriesService: ItemsCategoriesService,
        public snackBar: MatSnackBar,
        private router: Router,
        private itemsService: ItemsService,
        private itemsSuppliersService: ItemsSuppliersService,
        private salesQuotationService: salesQuotationService
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
            company: ['', Validators.required],
            date: ['', Validators.required],
            invoice_no: ['', Validators.required],
            ref_no: ['']

        });
    }
    initializeSupplierForm(): void {
        this.formSupplier = this.formBuilder.group({
            item_code: ['', Validators.required],
            qty: ['', Validators.required],
            available: ['', Validators.required],
            total: ['', Validators.required],
            selling_price: ['', Validators.required],
        });
    }
    saveItems(): void {
        const {  company,
            date,
            invoice_no,
            ref_no } = this.formGroup.value;
        this.isShowLoader = true;
        this.salesQuotationService
            .addSales({
                company,
                date,
                invoice_no,
                ref_no,
                sales: this.sales
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
        const { company,
            date,
            invoice_no,
            ref_no } = this.formGroup.value;
        this.isShowLoader = true;
        this.salesQuotationService
            .editSales({
                id: this.data.id, company,
                date,
                invoice_no,
                ref_no,
                sales: this.sales
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
    addSales() {
        const {
            item_code,
            qty,
            available,
            selling_price,
            total
        } = this.formSupplier.value
        const supplierName = this.suppliersCompany.find(x => +x.id === +item_code);
        const supplier = {
            item_code,
            qty,
            available,
            selling_price,
            total
        }
        this.suppliers.push(supplier)
        this.supplierDataSource = new MatTableDataSource<IItemSupplierData>(this.suppliers);
    }
    fillForm() {
        const {  company,
            date,
            invoice_no,
            ref_no} = this.data;
        this.formGroup.patchValue({
            company,
            date,
            invoice_no,
            ref_no
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
