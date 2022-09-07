import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { IPurchaseData } from 'src/app/models/purchase';
import { ISalesData } from 'src/app/models/sales';
import { ISalesQuotationData } from 'src/app/models/sales-quotation';
import { ISalesBillData } from 'src/app/models/sales_bill';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ItemsSuppliersService } from '../../items/services/items-supplier.service';
import { salesQuotationService } from '../../sales-quotation/services/sales-quotation.service';
import { SalesService } from '../../sales/services/sales.service';
import { PurchaseDetailsService } from '../services/purchase-details.service';
import { PurchaseService } from '../services/purchase.service';

@Component({
    selector: 'app-add-purchase',
    templateUrl: './add-purchase.component.html',
    styleUrls: ['./add-purchase.component.scss']
})
export class AddPurchaseComponent implements OnInit {
    displayedColumns: string[] = [
        'item_code',
        'qty',
        'selling_price',
        'total',
        'action',
    ];
    formSupplier: FormGroup;
    formGroup: FormGroup;
    formBill: FormGroup;
    isShowLoader = false;
    public defaultPageSize = PAGE_SIZE;
    supplier = []
    dataSource: any = [];
    suppliers = []
    supplierDataSource: any = [];
    totalRows: number;
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
    lastBillNo: number;
    countQty = [];
    Qty: number;
    countTotal = [];
    totalPrice: number;
    lastBillDue: number;
    dueLimit: number;
    grandDueTotal: number;
    currentPayment: number;
    otherPayment: number = 0;
    totalDue: number;
    sales = [];
    users;
    customer;
    companyName;
    remarks: string = " ";
    company: number = 75

    invoice_no: number = 0;
    currentDate = new Date();
    findPurchaseDetails
    supplierName
    supplierDetails

    //
    totalQty: number = 0;
    total: number = 0;
    availableItemById: number = 0

    purchaseData: any;
    supplierData: any;
    saleItems = [];
    purchaseItemDataSource: any = [];
    isEditSalesItem = false;
    showEditButton: boolean = false;
    isShowOtherPayment: boolean = false;
    isEditPurchaseItem: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data:  { supplierId: number, purchaseId?: number, pastDue: number },
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddPurchaseComponent>,
        private formBuilder: FormBuilder,
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private purchaseService: PurchaseService,
        private purchaseDetailsService: PurchaseDetailsService,
        public authService: AuthService
    ) { }
    ngOnInit() {
        this.users = this.authService.getUserData();

        this.initializeSupplierForm();
        this.initializeSalesBillForm();

        if (this.data.purchaseId) {
            this.getSupplierById();
            this.getPurchaseById();
            this.lastBillDue = this.data.pastDue;
            this.calculate();

        }
    }
    initializeSupplierForm(): void {
        this.formSupplier = this.formBuilder.group({
            item_id: [''],
            qty: [''],
            selling_price: [''],
        });
    }
    initializeSalesBillForm(): void {
        this.formBill = this.formBuilder.group({
            payment: [0, Validators.required],
            otherPayment: [0],
            remarks: ['']
        });
    }
    savePurchase(): void {
        const pendingDueTotal = +this.totalPrice + +this.lastBillDue
        this.company

        this.isShowLoader = true;
        this.purchaseService
            .addPurchase({
                invoice_no: this.invoice_no,
                qty: this.Qty,
                amount: this.totalPrice,
                user_name: this.users.user_name,
                pending_due: this.lastBillDue,
                total_due: this.totalDue,
                grand_total: this.grandDueTotal,
                remarks: this.remarks,
                supplier: this.supplierName,
                payment: this.currentPayment,
                other_payment: this.otherPayment,
                sales: this.sales,
                amount_pd_total: pendingDueTotal
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
    updatePurchase(): void {
        const pendingDueTotal = +this.totalPrice + +this.lastBillDue
        this.isShowLoader = true;
        this.purchaseService
            .editPurchase({
                id: this.data.purchaseId,
                invoice_no: this.invoice_no,
                qty: this.Qty,
                amount: this.totalPrice,
                user_name: this.users.user_name,
                pending_due: this.lastBillDue,
                total_due: this.totalDue,
                grand_total: this.grandDueTotal,
                remarks: this.remarks,
                supplier: this.supplierName,
                payment: this.currentPayment,
                other_payment: this.otherPayment,
                sales: this.sales,
                amount_pd_total: pendingDueTotal
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
        if (this.data.purchaseId) {
            this.updatePurchase();
        } else {
            this.savePurchase();
        }

    }


    addSalesQuotation() {
        const {
            item_id,
            qty,
            selling_price,
        } = this.formSupplier.value;
        const item = this.items.find(x => x.id === item_id);
        const salesItem = this.saleItems.find(x => +x.item_id === +item_id);
        if (salesItem) {
            salesItem.qty = +salesItem.qty + +qty;
            salesItem.total = +salesItem.total + (+salesItem.qty * +salesItem.selling_price);
        } else {
            this.saleItems.push({
                item_code: item.item_code,
                item_id,
                qty,
                selling_price,
            });
        }
        if (qty <= 0) {
            this.formBill.get("remarks").setValidators(Validators.required);
            setTimeout(() => {
                this.formBill.get("remarks").updateValueAndValidity()
            })
        }
        this.isEditPurchaseItem = false;
        this.purchaseItemDataSource  = new MatTableDataSource<IItemSupplierData>(this.saleItems);
        this.availableItemById = 0;
        this.calculate();
        this.clearPurchaseDetailsForm();
    }





    fillForm() {
        // if (!this.data.salesId) {
        //     this.lastBillDue = this.customerData.cdf_total_due;
        //     this.calculate();
        // }
        // this.customerName = this.customerData.company;
        // this.dueLimit = this.customerData.due_limit;
        // this.tier = this.customerData.tier_code;
    }
    supplierFillForm(itemId: number) {
        this.isEditSalesItem = true;
        const filteredItem = this.saleItems.find(x => +x.item_id === +itemId);
        const { item_id, qty, selling_price, } = filteredItem;
        this.formSupplier.patchValue({
            item_id,
            qty,
            selling_price,
        });
        this.fillSellingPrice(itemId)
     }
     getSupplierById() {
        this.purchaseService
            .getSupplierById(this.data.supplierId)
            .subscribe(
                (response) => {
                    this.supplierData = response;
                    this.getSupplierIdInPurchase();
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
    getPurchaseById() {
        this.purchaseService.getPurchaseById(this.data.purchaseId).subscribe(
            (response) => {
                this.purchaseData = response[0]
                this.lastBillNo = this.purchaseData.bill_no;
                this.formBill.value.remarks = this.purchaseData.remarks;
                if (this.purchaseData.other_payment) {
                    this.isShowOtherPayment = true;
                }
                this.formBill.patchValue({
                    payment: this.purchaseData.payment,
                    otherPayment: this.purchaseData.other_payment
                });
                this.calculate();
            },
            (error) => {
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }
    getSupplierIdInPurchase() {
        this.purchaseService.isSupplierIdInPurchase(this.data.supplierId).subscribe(
            (response) => {
                this.lastBillNo = response[0].count
                this.fillForm();
            },
            (error) => {
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }


    fillSellingPrice(itemId) {
        const item = this.items.find(x => x.id === itemId)
        this.availableItemById = +item.int_qty + +item.item_purchased - +item.item_sold;
        this.formSupplier.patchValue({
            item_id: item.id,
            selling_price: item.silver
        });
    }

    removePurchaseDetails(itemId: number): void {
        const filteredItems = this.saleItems.filter(x => +x.item_id !== itemId);
        this.saleItems = filteredItems;
        this.calculate();
        this.purchaseItemDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
    }

    clearPurchaseDetailsForm(): void {
        this.formSupplier.patchValue({
            item_id: '',
            qty: '',
            selling_price: '',
        });
    }

    getItemWiseTotal() {
        if (this.formSupplier.value.qty !== '') {
            return (+this.formSupplier.value.qty * +this.formSupplier.value.selling_price)
        }
        return 0;
    }
    calculate() {
        this.totalQty = 0
        this.total = 0;
        this.saleItems.forEach(saleItem => {
            this.totalQty = +this.totalQty + +saleItem.qty;
            this.total = +this.total + (+saleItem.qty * +saleItem.selling_price);
        });
        this.grandDueTotal = (+this.total + +this.lastBillDue);
        this.totalDue = +this.grandDueTotal - +this.formBill.value.payment;
    }
    hideShowOther() {
        if (this.isShowOtherPayment === false) {
            this.isShowOtherPayment = true
        } else {
            this.isShowOtherPayment = false;
        }
    }

}
