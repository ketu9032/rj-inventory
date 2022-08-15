import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
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
        'selling_price',
        'total',
        'action',
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
    salesItem = [];
    customers = [];
    items = [];
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    selectCustomerLoader: boolean = false;
    selectItemLoader: boolean = false;

    supplierRate: string = "";
    supplierQty: string = "";
    totalQty: number;
    lastBillNo: number;
    countQty = [];
    Qty: number;
    countTotal = [];
    totalPrice: number;
    lastBillDue: number = 0;
    dueLimit: number;
    grandDueTotal: number;
    currentPayment: number;
    totalDue: number;
    sales = [];
    total: number;
    users;
    user_name: string ;
    tier: string ;
    remarks: string = 'test';

    currentDate;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ISalesQuotationData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateQuotationComponent>,
        private formBuilder: FormBuilder,
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private itemsSuppliersService: ItemsSuppliersService,
        private salesQuotationService: salesQuotationService,
        public authService: AuthService
        ) { }
        ngOnInit() {
        this.users = this.authService.getUserData();
        this.initializeForm();
        this.initializeSupplierForm();
        this.getItemDropDown();
        //  this.getSuppliersDropDown()
        if (this.data && this.data.id) {
            this.fillForm();
            this.getItemSupplier();
        }
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            tier: ['', Validators.required],
            date: ['', Validators.required],
            invoice_no: ['', Validators.required],
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

    saveSalesQuotation(): void {
        const {
            date,
            invoice_no,
        } = this.formGroup.value;
           this.Qty;
           this.currentPayment;
          this.totalDue
           this.user_name;
           this.tier;
           this.remarks;

        this.isShowLoader = true;
        this.salesQuotationService
            .addSalesQuotation({
                date,
                invoice_no,
                qty: this.Qty,
                amount: this.currentPayment,
                total_due: this.totalDue,
                user_name: this.users.user_name,
                tier: this.tier,
                remarks: this.remarks,
                sales: this.sales
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Sales quotation saved successfully', 'OK', {
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
    updateSalesQuotation(): void {
        const {
            date,
            invoice_no,
        } = this.formGroup.value;
        this.isShowLoader = true;
        this.salesQuotationService
            .editSalesQuotation({
                id: this.data.id,
                date,
                invoice_no,
                qty: this.Qty,
                amount: this.currentPayment,
                total_due: this.totalDue,
                user_name: this.user_name,
                tier: this.tier,
                remarks: this.remarks,
                sales: this.sales
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Sales quotation updated successfully', 'OK', {
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
            this.updateSalesQuotation();
        } else {
            this.saveSalesQuotation();
        }
        // this.clearSupplierForm();
    }
    addSalesQuotation() {
        const {
            item_code,
            qty,
            available,
            selling_price,
            total
        } = this.formSupplier.value
        const sale = {
            item_code,
            qty,
            available,
            selling_price,
            total
        }
        this.sales.push(sale)
        this.supplierDataSource = new MatTableDataSource<IItemSupplierData>(this.sales);
    }
    fillForm() {
        const {
            date,
            invoice_no,
           } = this.data;
        this.formGroup.patchValue({

            date,
            invoice_no,
        });
    }
    // confirmDialog(id: string): void {
    //     this.dialog
    //         .open(DeleteCreateQuotationComponent, {
    //             maxWidth: '400px',
    //             data: id
    //         })
    //         .afterClosed()
    //         .subscribe((result) => {
    //             if (result && result.data === true) {
    //                 this.getCategory();
    //             }
    //         });
    // }
    // supplierFillForm(suppliersId) {
    //     const itemSupplierRate = this.sales.find(x => +x.suppliers_id === +suppliersId).item_supplier_rate;
    //     this.formSupplier.patchValue({
    //         salesQuotationId: this.data.id, item_code, item_supplier_rate: itemSupplierRate
    //     });
    // }

    // getSuppliersDropDown() {
    //     this.itemsSuppliersService
    //         .getItemSupplierDropDown()
    //         .subscribe(
    //             (response) => {
    //                 this.suppliersCompany = response;
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
    count() {
        if (this.formSupplier.value.qty !== '') {
            this.total = (this.formSupplier.value.qty * this.formSupplier.value.selling_price)
            this.formSupplier.patchValue({
                total: this.total
            })
        }
        console.log(this.total);
    }

    getItemDropDown() {
        this.selectItemLoader = true;
        this.salesQuotationService
            .getItemDropDown()
            .subscribe(
                (response) => {
                    this.items = response;
                    this.selectItemLoader = false;
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
    add() {
        this.countQty.push(this.formSupplier.value.qty)
        this.Qty = this.countQty.reduce((acc, cur) => acc + cur, 0);
        this.countTotal.push(this.total)
        this.totalPrice = this.countTotal.reduce((acc, cur) => acc + Number(cur), 0)
        this.grandDueTotal = (+this.totalPrice + +this.lastBillDue)
    }
    totalDueCount() {
        this.totalDue = this.grandDueTotal - this.currentPayment

    }
    fillSellingPrice(item) {
        this.formSupplier.patchValue({
            item_code: item.item_code,
            available: item.int_qty,
           selling_price: item.silver
        });
    }
    fillDueAndDueLimit(customer) {
            this.lastBillDue =  customer.balance,
            this.dueLimit = customer.due_limit
    }

}
