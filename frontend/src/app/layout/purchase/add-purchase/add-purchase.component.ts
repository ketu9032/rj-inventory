import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { IPurchaseDetailsData } from 'src/app/models/purchase-details';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ConfirmBoxComponent } from '../../sales/add-sales/confirm-box/confirm-box.component';
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
    formBill: FormGroup;
    isShowLoader = false;
    public defaultPageSize = PAGE_SIZE;
    items = [];
    tableParams: IMatTableParams = {
        pageSize: this.defaultPageSize,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    selectItemLoader: boolean = false;
    lastBillNo: number = 0;
    lastBillDue: number;
    dueLimit: number;
    grandDueTotal: number;
    totalDue: number;
    weight: number = 0;
    sales = [];
    loggedInUser: any;
    currentDate = new Date();
    supplierName: any;
    //
    totalQty: number = 0;
    total: number = 0;
    availableItemById: number = 0
    purchaseData: any;
    supplierData: any;
    saleItems = [];
    allSupplierData: any;
    purchaseItemDataSource: any = [];
    isEditSalesItem = false;
    isShowOtherPayment: boolean = false;
    isEditPurchaseItem: boolean = false;
    isShowRemarksError: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { supplierId: number, purchaseId?: number, pastDue: number },
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
        this.loggedInUser = this.authService.getUserData();
        this.getSuppliersDropDown();
        this.initializeSupplierForm();
        this.initializeSalesBillForm();
        this.getItemDropDown();
        if (this.data.purchaseId) {
            this.getItemByPurchaseId()
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
            weight: ['']
        });
    }
    initializeSalesBillForm(): void {
        this.formBill = this.formBuilder.group({
            payment: [0, Validators.required],
            otherPayment: [0],
            remarks: [''],
            weight: ['']
        });
    }
    savePurchase(): void {
        this.isShowLoader = true;
        this.purchaseService
            .addPurchase({
                user_id: this.loggedInUser.id,
                remarks: this.formBill.value.remarks,
                suppliers_id: this.data.supplierId,
                payment: this.formBill.value.payment,
                other_payment: this.formBill.value.otherPayment,
                sales: this.saleItems,
                past_due: this.lastBillDue
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Purchase saved successfully', 'OK', {
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
        this.isShowLoader = true;
        this.purchaseService
            .editPurchase({
                id: this.data.purchaseId,
                user_id: this.loggedInUser.id,
                remarks: this.formBill.value.remarks,
                suppliers_id: this.data.supplierId,
                payment: this.formBill.value.payment,
                other_payment: this.formBill.value.otherPayment,
                sales: this.saleItems,
                past_due: this.lastBillDue
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Purchase updated successfully', 'OK', {
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
        if (this.dueLimit < this.totalDue) {
            this.confirmDialog()
        } else {
            if (this.data.purchaseId) {
                this.updatePurchase();
            } else {
                this.savePurchase();
            }
        }
    }
    addSalesQuotation() {
        const {
            item_id,
            qty,
            selling_price,
            weight
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
                weight
            });
        }
        if (qty <= 0) {
            this.isShowRemarksError = true;
            this.formBill.get("remarks").setValidators(Validators.required);
            setTimeout(() => {
                this.formBill.get("remarks").updateValueAndValidity()
            })
        }
        this.isEditPurchaseItem = false;
        this.purchaseItemDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
        this.availableItemById = 0;
        this.calculate();
        this.clearPurchaseDetailsForm();
    }
    fillForm() {
        if (!this.data.purchaseId) {
            this.lastBillDue = this.supplierData.suppliers_total_due;
            this.calculate();
        }
        this.supplierName = this.supplierData.company;
        this.dueLimit = this.supplierData.due_limit;
    }
    getItemDropDown() {
        this.selectItemLoader = true;
        this.purchaseService
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
    fillSellingPrice(itemId) {
        const item = this.items.find(x => x.id === itemId)
        this.availableItemById = +item.int_qty + +item.item_purchased - +item.item_sold;
        this.formSupplier.patchValue({
            item_id: item.id,
            selling_price: item.silver,
            weight: item.weight
        });
    }
    supplierFillForm(itemId: number) {
        this.isEditSalesItem = true;
        const filteredItem = this.saleItems.find(x => +x.item_id === +itemId);
        const { item_id, qty, selling_price, weight } = filteredItem;
        this.formSupplier.patchValue({
            item_id,
            qty,
            selling_price,
            weight
        });
        this.fillSellingPrice(itemId)
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
    getSuppliersDropDown() {
        this.purchaseService
            .getSupplierDropDown()
            .subscribe(
                (response) => {
                    this.allSupplierData = response;
                    this.filSupplierDetalis();
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
                this.purchaseData = response
                this.lastBillNo = this.purchaseData.bill_no;
                this.formBill.value.remarks = this.purchaseData.remarks;
                if (this.purchaseData.other_payment) {
                    this.isShowOtherPayment = true;
                }
                this.formBill.patchValue({
                    payment: this.purchaseData[0].payment,
                    otherPayment: this.purchaseData[0].other_payment
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
    hideShowOther() {
        if (this.isShowOtherPayment === false) {
            this.isShowOtherPayment = true
        } else {
            this.isShowOtherPayment = false;
        }
    }
    getSupplierIdInPurchase() {
        this.purchaseService.isSupplierIdInPurchase(this.data.supplierId).subscribe(
            (response) => {
                this.lastBillNo = response[0].count
            },
            (error) => {
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }
    getItemWiseTotal() {
        if (this.formSupplier.value.qty !== '') {
            return (+this.formSupplier.value.qty * +this.formSupplier.value.selling_price)
        }
        return 0;
    }
    calculate() {
        this.totalQty = 0;
        this.total = 0;
        this.weight = 0;
        this.saleItems.forEach(saleItem => {
            this.totalQty = +this.totalQty + +saleItem.qty;
            this.total = +this.total + (+saleItem.qty * +saleItem.selling_price);
            this.weight = +this.weight + (+saleItem.qty * +saleItem.weight)
        });
        this.grandDueTotal = (+this.total + +this.lastBillDue);
        this.totalDue = +this.grandDueTotal - +this.formBill.value.payment;
    }
    filSupplierDetalis() {
        this.supplierData = this.allSupplierData.find(x => x.id === this.data.supplierId)
        this.supplierName = this.supplierData.company;
        if (!this.data.purchaseId) {
            this.lastBillDue = +this.supplierData.suppliers_total_due;
        }
        this.dueLimit = this.supplierData.due_limit;
    }
    getItemByPurchaseId() {
        this.purchaseItemDataSource = [];
        this.purchaseDetailsService.getItemsByPurchaseId(this.data.purchaseId).subscribe(
            (response) => {
                this.saleItems.push(...response)
                this.calculate();
                this.purchaseItemDataSource = new MatTableDataSource<IPurchaseDetailsData>(response);
            },
            (error) => {
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }
    confirmDialog(): void {
        this.dialog
            .open(ConfirmBoxComponent, {
                maxWidth: '500px',
            })
            .afterClosed()
            .subscribe((result) => {
                if (result && result.data === true) {
                    if (this.data.purchaseId) {
                        this.updatePurchase();
                    } else {
                        this.savePurchase();
                    }
                }
            });
    }
}
