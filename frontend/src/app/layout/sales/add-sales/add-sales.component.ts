import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { ISalesBillData } from 'src/app/models/sales_bill';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { salesQuotationService } from '../../sales-quotation/services/sales-quotation.service';
import { SalesBillService } from '../services/sales-bill.service';
import { SalesService } from '../services/sales.service';
@Component({
    selector: 'app-add-sales',
    templateUrl: './add-sales.component.html',
    styleUrls: ['./add-sales.component.scss']
})
export class AddSalesComponent implements OnInit {
    totalQty: number = 0;
    total: number = 0;
    lastBillDue: number = 0;
    dueLimit: number = 0;
    grandDueTotal: number = 0;
    totalDue: number = 0;
    lastBillNo: number = 0;
    bill_no: number = 0;
    availableItemById = 0;
    isShowOtherPayment: boolean = false;
    isEditSalesItem = false;
    isShowLoader = false;
    selectItemLoader: boolean = false;
    loggedInUser: any;
    customerData: any;
    currentDate = new Date();
    salesData: any;
    customerName: string;
    tier: string = '';

    salesItemDataSource: any = [];
    items = [];
    saleItems = [];
    displayedColumns: string[] = [
        'item_code',
        'qty',
        'selling_price',
        'total',
        'action',
    ];
    tableParams: IMatTableParams = {
        pageSize: PAGE_SIZE,
        pageNumber: 1,
        orderBy: 'id',
        direction: "desc",
        search: '',
        active: true
    }
    formSupplier: FormGroup;
    formBill: FormGroup;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { customerId: number, salesId?: number, pastDue: number },
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddSalesComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private salesQuotationService: salesQuotationService,
        private salesService: SalesService,
        private salesBillService: SalesBillService,
        public authService: AuthService
    ) { }
    ngOnInit() {
        this.loggedInUser = this.authService.getUserData();
        this.getCustomerById();
        this.initializeSupplierForm();
        this.initializeSalesBillForm()
        this.getItemDropDown();
        if (this.data.salesId) {
            this.getItemsBySalesId();
            this.getSalesById();
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
    saveSales(): void {

        this.isShowLoader = true;
        this.salesService
            .addSales({
                bill_no: this.bill_no,
                user_id: this.loggedInUser.id,
                tier: this.tier,
                remarks: this.formBill.value.remarks,
                customer_id: this.data.customerId,
                payment: this.formBill.value.payment,
                other_payment: this.formBill.value.otherPayment,
                sales: this.saleItems,
                past_due: this.lastBillDue
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
    updateSales(): void {



        this.isShowLoader = true;
        this.salesService
            .editSales({
                id: this.data.salesId,
                bill_no: this.bill_no,
                user_id: this.loggedInUser.id,
                tier: this.tier,
                remarks: this.formBill.value.remarks,
                customer_id: this.salesData.customer_id,
                payment: this.formBill.value.payment,
                other_payment: this.formBill.value.otherPayment,
                sales: this.saleItems,
                past_due: this.lastBillDue
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Sales updated Successfully', 'OK', {
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
        if (this.data.salesId) {
            this.updateSales();
        } else {
            this.saveSales();
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
        this.isEditSalesItem = false;
        this.salesItemDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
        this.availableItemById = 0;
        this.calculate();
        this.clearSalesDetailsForm();
    }
    fillForm() {
        if (!this.data.salesId) {
            this.lastBillDue = this.customerData.cdf_total_due;
            this.calculate();
        }
        this.customerName = this.customerData.company;
        this.dueLimit = this.customerData.due_limit;
        this.tier = this.customerData.tier_code;
    }
    getItemsBySalesId() {
        this.salesItemDataSource = [];
        this.salesBillService.getItemsBySalesId(this.data.salesId).subscribe(
            (response) => {
                this.saleItems.push(...response)
                this.calculate();
                this.salesItemDataSource = new MatTableDataSource<ISalesBillData>(response);
            },
            (error) => {
                this.snackBar.open(error.error.message || error.message, 'Ok', {
                    duration: 3000
                });
            },
            () => { }
        );
    }
    getItemDropDown() {
        this.selectItemLoader = true;
        this.salesService
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
    fillSellingPrice(itemId: number) {
        const item = this.items.find(x => x.id === itemId)
        this.availableItemById = +item.int_qty + +item.item_purchased - +item.item_sold;
        this.formSupplier.patchValue({
            item_id: item.id,
            selling_price: item.silver
        });
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
    removeItem(itemId: number): void {
        const filteredItems = this.saleItems.filter(x => +x.item_id !== itemId);
        this.saleItems = filteredItems;
        this.calculate();
        this.salesItemDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
    }
    clearSalesDetailsForm(): void {
        this.formSupplier.patchValue({
            item_id: '',
            qty: '',
            selling_price: '',
        });
    }
    getCustomerById() {
        this.salesService
            .getCustomerById(this.data.customerId)
            .subscribe(
                (response) => {
                    this.customerData = response;
                    this.getCustomerIdInSales();
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
    getSalesById() {
        this.salesService.getSalesById(this.data.salesId).subscribe(
            (response) => {
                this.salesData = response[0]
                this.lastBillNo = this.salesData.bill_no;
                this.formBill.value.remarks = this.salesData.remarks;
                if (this.salesData.other_payment) {
                    this.isShowOtherPayment = true;
                }
                this.formBill.patchValue({
                    payment: this.salesData.payment,
                    otherPayment: this.salesData.other_payment
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
    getCustomerIdInSales() {
        this.salesService.isCustomerIdInSales(this.data.customerId).subscribe(
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
    totalDueOverToDueLimit(value){
        if(this.dueLimit < this.totalDue){
          let msg = 'You are Over Due limit!'
        return false;
            }else{
                return true;
            }

        }
}
