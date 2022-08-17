import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { ISalesQuotationData } from 'src/app/models/sales-quotation';
import { ISalesQuotationDetailsData } from 'src/app/models/sales-quotation-details';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ItemsSuppliersService } from '../../items/services/items-supplier.service';
import { salesQuotationService } from '../services/sales-quotation.service';
import { salesQuotationDetailsService } from '../services/sales-quotation-details.service';
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
    sales = []
    salesDataSource: any = [];
    totalRows: number;
    salesItem = [];
    customers = [];
    suppliersCompany = [];
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
    lastBillDue: number = 1;
    dueLimit: number;
    grandDueTotal: number;
    shippingPayment: number;
    gst;
    totalDue;

    total: number;
    users;
    user_name: string;
    tier: string;
    remarks: string;
    invoiceNo: number = 0;
    currentDate = new Date();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ISalesQuotationData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateQuotationComponent>,
        private formBuilder: FormBuilder,
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private itemsSuppliersService: ItemsSuppliersService,
        private salesQuotationService: salesQuotationService,
        private salesQuotationDetailsService: salesQuotationDetailsService,
        public authService: AuthService,

    ) { }
    ngOnInit() {
        this.tier = this.data.tier;
        this.users = this.authService.getUserData();
        this.initializeForm();
        this.initializeSupplierForm();
        this.getItemDropDown();

        if (this.data.id) {
            this.fillForm();
            this.getSalesQuotationDetails();
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
        const { tier,
            date,
            invoice_no,
        } = this.formGroup.value;
        this.Qty;
        this.grandDueTotal;
        this.totalDue
        this.user_name;
        this.remarks;
        this.isShowLoader = true;
        this.salesQuotationService
            .addSalesQuotation({
                date,
                invoice_no,
                tier,
                qty: this.Qty,
                amount: this.grandDueTotal,
                total_due: this.totalDue,
                shipping: this.shippingPayment,
                gst: this.gst,
                user_name: this.users.user_name,
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
                amount: this.shippingPayment,
                total_due: this.totalDue,
                shipping: this.shippingPayment,
                gst: this.gst,
                user_name: this.users.user_name,
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

        if (this.data.id) {
            this.updateSalesQuotation();
        } else {
            this.saveSalesQuotation();
        }
    }
    addSalesQuotation() {
        const {
            item_code,
            qty,
            available,
            selling_price,
            total
        } = this.formSupplier.value
        const itemCode = this.suppliersCompany.find(x => +x.id === +item_code);
        const sale = {
            item_code,
            qty,
            available,
            selling_price,
            total
        }
        this.sales.push(sale)
        this.salesDataSource = new MatTableDataSource<IItemSupplierData>(this.sales);
    }
    fillForm() {
        const {
            tier,
            date,
            invoice_no,
        } = this.data;
        this.formGroup.patchValue({
            tier,
            date,
            invoice_no,
        });
        this.Qty = this.data.qty,
        this.grandDueTotal = this.data.amount,
            this.totalDue = this.data.total_due,
            this.shippingPayment = this.data.shipping,
            this.gst = this.data.gst,
            this.users.user_name = this.data.user_name,
            this.remarks = this.data.remarks
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
    // salesDetailsFillForm(suppliersId) {
    //     const itemSupplierRate = this.sales.find(x => +x.suppliers_id === +suppliersId).item_supplier_rate;
    //     this.formSupplier.patchValue({
    //         salesQuotationId: this.data.id, item_code: itemCode, item_supplier_rate: itemSupplierRate
    //     });
    // }



    getSalesQuotationDetails() {
        this.salesDataSource = [];
        this.sales = []
        this.tableParams.salesQuotationId = this.data.id;
        this.salesQuotationDetailsService.getSalesQuotationDetail(this.tableParams).subscribe(
            (newSalesDetails: any[]) => {
                this.sales.push(...newSalesDetails);
                this.salesDataSource = new MatTableDataSource<ISalesQuotationDetailsData>(newSalesDetails);
                if (newSalesDetails.length > 0) {
                    this.totalRows = newSalesDetails[0].total;
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
        this.totalDue = (+this.grandDueTotal + +this.shippingPayment + +this.gst)

    }
    fillSellingPrice(item) {
        this.formSupplier.patchValue({
            item_code: item.item_code,
            available: item.int_qty,
            selling_price: item.silver
        });
    }
    fillDueAndDueLimit(customer) {
        this.lastBillDue = customer.balance,
            this.dueLimit = customer.due_limit
    }

}
