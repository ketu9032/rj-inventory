import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { ISalesData } from 'src/app/models/sales';
import { ISalesQuotationData } from 'src/app/models/sales-quotation';
import { ISalesBillData } from 'src/app/models/sales_bill';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ItemsSuppliersService } from '../../items/services/items-supplier.service';
import { salesQuotationService } from '../../sales-quotation/services/sales-quotation.service';
import { SalesService } from '../services/sales.service';
@Component({
    selector: 'app-add-sales',
    templateUrl: './add-sales.component.html',
    styleUrls: ['./add-sales.component.scss']
})
export class AddSalesComponent implements OnInit {
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
    salesItemDataSource: any = [];
    selectItemLoader: boolean = false;
    items = [];
    tableParams: IMatTableParams = {
        pageSize: PAGE_SIZE,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    totalQty: number = 0;
    totalPrice: number = 0;
    lastBillDue: number = 0;
    dueLimit: number = 0;
    grandDueTotal: number = 0;
    currentPayment: number = 0;
    otherPayment: number = 0;
    totalDue: number = 0;
    saleItems = [];
    total: number = 0;
    loggedInUser;
    customerData: any;
    customerName: string;
    tier: string = '';
    remarks: string;
    currentDate = new Date();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ISalesData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddSalesComponent>,
        private formBuilder: FormBuilder,
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private itemsSuppliersService: ItemsSuppliersService,
        private salesQuotationService: salesQuotationService,
        private salesService: SalesService,
        public authService: AuthService
    ) { }
    ngOnInit() {
        console.log(this.data);
        this.loggedInUser = this.authService.getUserData();
        this.customerData = this.data.customer[0]
        this.customerName = this.customerData.company
        debugger
        this.lastBillDue = this.customerData.balance
        this.grandDueTotal = this.customerData.balance
        this.dueLimit = this.customerData.due_limit
        this.tier = this.customerData.tier_code
        this.totalDue = this.customerData.balance
        this.initializeSupplierForm();
        this.initializeSalesBillForm()
        this.getItemDropDown();
        if (this.data.id) {
            this.fillForm();
            this.getItemsBySalesId();
        }
    }
    initializeSupplierForm(): void {
        this.formSupplier = this.formBuilder.group({
            item_id: ['', Validators.required],
            qty: ['', Validators.required],
            available: ['', Validators.required],
            total: ['', Validators.required],
            selling_price: ['', Validators.required],
        });
    }
    initializeSalesBillForm(): void {
        this.formBill = this.formBuilder.group({
            payment: ['', Validators.required],
            remarks: ['']
        });
    }
    saveSales(): void {
        const pendingDueTotal = +this.totalPrice + +this.lastBillDue;
        this.isShowLoader = true;
        this.salesService
            .addSales({
                qty: this.totalQty,
                amount: this.totalPrice,
                user_name: this.loggedInUser.user_name,
                pending_due: this.lastBillDue,
                total_due: this.totalDue,
                tier: this.tier,
                grand_total: this.grandDueTotal,
                remarks: this.remarks,
                customer: this.customerName,
                payment: this.currentPayment,
                other_payment: this.otherPayment,
                sales: this.saleItems,
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
    // updateSalesQuotation(): void {

    //     this.isShowLoader = true;
    //     this.salesService
    //         .editSales({
    //             id: this.data.id,
    //             qty: this.totalQty,
    //             amount: this.currentPayment,
    //             total_due: this.totalDue,
    //             user_name: this.user_name,
    //             tier: this.tier,
    //             remarks: this.remarks,
    //             sales: this.sales,
    //         })
    //         .subscribe(
    //             (response) => {
    //                 this.isShowLoader = false;
    //                 this.snackBar.open('Sales quotation updated successfully', 'OK', {
    //                     duration: 3000
    //                 });
    //                 this.dialogRef.close(true);
    //             },
    //             (error) => {
    //                 this.isShowLoader = false;
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
    onSubmit() {
        if (this.data && this.data.id) {
            //     this.updateSalesQuotation();
        } else {
            this.saveSales();
        }
        // this.clearSupplierForm();
    }
    addSalesQuotation() {
        const {
            item_id,
            qty,
            available,
            selling_price,
            total
        } = this.formSupplier.value;
        const item = this.items.find(x => x.id === item_id);
        const sale = {
            item_code: item.item_code,
            item_id,
            qty,
            available,
            selling_price,
            total
        }
        this.saleItems.push(sale);
        this.totalQty = 0
        this.totalPrice = 0;
        this.saleItems.forEach(saleItem => {
            this.totalQty += saleItem.qty;
            this.totalPrice += saleItem.total;
        });
        this.grandDueTotal = (+this.totalPrice + +this.lastBillDue)
        if (qty <= 0) {
            this.formBill.get("remarks").setValidators(Validators.required);
            setTimeout(() => {
                this.formBill.get("remarks").updateValueAndValidity()
            })
        }
        this.salesItemDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
        this.clearSalesDetailsForm();
    }
    fillForm() {
            this.totalPrice = this.data.amount,
            this.totalQty = this.data.qty
            this.lastBillDue = this.data.pending_due,
            this.totalDue = this.data.total_due,
            this.tier = this.data.tier,
            this.grandDueTotal = this.data.grand_total,
            this.remarks = this.data.remarks,
            this.customerName = this.data.customer,
            this.currentPayment = this.data.payment,
            this.otherPayment = this.data.other_payment
    }
    count() {
        if (this.formSupplier.value.qty !== '') {
            this.total = (+this.formSupplier.value.qty * +this.formSupplier.value.selling_price)
            this.formSupplier.patchValue({
                total: this.total
            })
        }
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
    totalDueCount() {
        this.totalDue = this.grandDueTotal - this.currentPayment
    }
    fillSellingPrice(item) {
        this.formSupplier.patchValue({
            item_id: item.id,
            available: item.int_qty,
            selling_price: item.silver
        });
    }
    fillDueAndDueLimit(customer) {
        this.lastBillDue = customer.balance,
            this.dueLimit = customer.due_limit
    }
    removeItem(element): void {
        for (let index = 0; index < this.saleItems.length; index++) {
        const filteredElement = this.saleItems[index];
        if(filteredElement.item_id === element){
           this.saleItems.splice(this.saleItems[index])
           this.salesItemDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
        }
        }
        console.log(element);
    }
    getItemsBySalesId() {
    }
    clearSalesDetailsForm(): void {
        this.formSupplier.patchValue({
            item_id: '',
            qty: '',
            available: '',
            selling_price: ' ',
            total: ''
        });
    }
}
