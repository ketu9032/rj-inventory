import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { ISalesData } from 'src/app/models/sales';
import { ISalesBillData } from 'src/app/models/sales_bill';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { CdfService } from '../../cdf/services/cdf.service';
import { salesQuotationService } from '../../sales-quotation/services/sales-quotation.service';
import { SalesBillService } from '../services/sales-bill.service';
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
    isShowLoader = false;
    selectItemLoader: boolean = false;
    salesItemDataSource: any = [];
    items = [];
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
    lastBillNo: number = 0;
    customerData: any;
    customerName: string;
    tier: string = '';
    remarks: string = 'testing';
    currentDate = new Date();
    findSalesBill;
    bill_no: number = 0;
    salesData;
    customer_id
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { customerId: number, salesId?: number },
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
        // this.customerData = this.data.customer[0]
        this.initializeSupplierForm();
        this.initializeSalesBillForm()
        this.getItemDropDown();
        if (this.data.salesId) {
            this.getSalesById();
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
                bill_no: this.bill_no,
                user_name: this.loggedInUser.user_name,
                pending_due: this.lastBillDue,
                total_due: this.totalDue,
                tier: this.tier,
                grand_total: this.grandDueTotal,
                remarks: this.remarks,
                customer_id: this.data.customerId,
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
    updateSales(): void {
        const pendingDueTotal = +this.totalPrice + +this.lastBillDue;
        this.isShowLoader = true;
        this.salesService
            .editSales({
                // id: this.data.id,
                qty: this.totalQty,
                bill_no: this.bill_no,
                amount: this.totalPrice,
                user_name: this.loggedInUser.user_name,
                pending_due: this.lastBillDue,
                total_due: this.totalDue,
                tier: this.tier,
                grand_total: this.grandDueTotal,
                remarks: this.remarks,
                customer_id: this.customer_id,
                payment: this.currentPayment,
                other_payment: this.otherPayment,
                sales: this.saleItems,
                amount_pd_total: pendingDueTotal
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
            debugger
               this.updateSales();
        } else {
            this.saveSales();
        }
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
        const salesItem = this.saleItems.find(x => +x.item_id === +item_id);
        if (salesItem) {
            salesItem.qty += +qty;
            salesItem.total += +total;
        } else {
            this.saleItems.push({
                item_code: item.item_code,
                item_id,
                qty,
                available,
                selling_price,
                total
            });
        }
        this.totalQty = 0
        this.totalPrice = 0;
        this.saleItems.forEach(saleItem => {
            this.totalQty += +saleItem.qty;
            this.totalPrice += +saleItem.total;
        });
        this.grandDueTotal = (+this.totalPrice + +this.lastBillDue)
        this.totalDue = this.grandDueTotal
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
        // this.totalPrice = this.data.amount,
        // this.totalQty = this.data.qty
        // this.lastBillDue = this.data.pending_due,
        // this.totalDue = this.data.total_due,
        // this.tier = this.data.tier,
        // this.grandDueTotal = this.data.grand_total,
        // this.remarks = this.data.remarks,
        // this.customerName = this.data.customer,
        // this.currentPayment = this.data.payment,
        // this.otherPayment = this.data.other_payment
    }
    getItemsBySalesId() {
        this.salesItemDataSource = [];
        this.salesBillService.getItemsBySalesId(this.data.salesId).subscribe(
            (response) => {
                this.saleItems.push(...response)
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
    removeItem(itemId: number): void {
        const filteredItems = this.saleItems.filter(x => +x.item_id !== itemId);
        this.saleItems = filteredItems;
        this.salesItemDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
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
    getCustomerById() {
        this.salesQuotationService
            .getCustomerById(this.data.customerId)
            .subscribe(
                (response) => {
                    this.customerData = response;
                    this.customerName = this.customerData.company
                    this.lastBillDue = this.customerData.balance
                    this.grandDueTotal = this.customerData.balance
                    this.dueLimit = this.customerData.due_limit
                    this.tier = this.customerData.tier_code
                    this.totalDue = this.customerData.balance
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
                this.salesData = response
                console.log(this.salesData);
                    this.totalPrice = this.salesData.amount,
                    this.totalQty = this.salesData.qty
                    this.lastBillDue = this.salesData.pending_due,
                    this.totalDue = this.salesData.total_due,
                    this.tier = this.salesData.tier,
                    this.grandDueTotal = this.salesData.grand_total,
                    this.remarks = this.salesData.remarks,
                    this.customerName = this.salesData.customer,
                    this.currentPayment = this.salesData.payment,
                    this.otherPayment = this.salesData.other_payment
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
