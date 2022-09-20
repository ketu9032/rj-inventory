import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { IItemSupplierData } from 'src/app/models/item_supplier';
import { ISalesQuotationData } from 'src/app/models/sales-quotation';
import { ISalesQuotationDetailsData } from 'src/app/models/sales-quotation-details';
import { IMatTableParams } from 'src/app/models/table';
import { PAGE_SIZE } from 'src/app/shared/global/table-config';
import { ItemsSuppliersService } from '../../items/services/items-supplier.service';
import { salesQuotationService } from '../services/sales-quotation.service';
import { salesQuotationDetailsService } from '../services/sales-quotation-details.service';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { SalesBillService } from '../../sales/services/sales-bill.service';
import { TiersService } from '../../customers/services/tiers.service';
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
    formBill: FormGroup;
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
    lastBillNo: number = 0;
    countQty = [];
    Qty: number;
    countTotal = [];
    totalPrice: number;
    lastBillDue: number = 0;
    dueLimit: number;
    grandDueTotal: number;
    shippingPayment;
    shippingPay: number;
    gst: number;
    totalDue: number;
    total: number;
    users;
    user_name: string;
    tier;
    remarks: string = "";
    invoiceNo: number = 0;
    currentDate = new Date();
    isShippingChecked:boolean = false;
    availableItemById = 0;
    isEditSalesItem = false;
    saleItems = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ISalesQuotationData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CreateQuotationComponent>,
        private formBuilder: FormBuilder,
        private _formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private tiersService: TiersService,
        private salesQuotationService: salesQuotationService,
        private salesQuotationDetailsService: salesQuotationDetailsService,

        public authService: AuthService,
    ) { }
    ngOnInit() {
        this.getTierDropDown()
        this.users = this.authService.getUserData();
        this.initializeSupplierForm();
        this.initializeSalesBillForm()
        this.getItemDropDown();
        if (this.data.id) {
            this.getItemsBySalesQuotationId();
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
            shipping: [0],
            gst: [0],
            remarks: ['', Validators.required]
        });
    }
    saveSalesQuotation(): void {
        if (this.shippingPayment === undefined) {
            this.shippingPayment = 0;
        }
        if (this.gst === undefined) {
            this.gst = 0;
        }
        this.isShowLoader = true;
        this.salesQuotationService
            .addSalesQuotation({

                tier_id: this.data.tier_id,
                qty: this.totalQty,
                amount: this.grandDueTotal,
                total_due: this.grandDueTotal,
                shipping: this.formBill.value.shipping,
                gst: this.formBill.value.gst,
                user_name: this.users.user_name,
                remarks: this.formBill.value.remarks,
                sales: this.saleItems
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

        this.isShowLoader = true;
        this.salesQuotationService
            .editSalesQuotation({
                id: this.data.id,
                qty: this.totalQty,
                amount: this.grandDueTotal,
                total_due:  this.grandDueTotal,
                shipping: this.formBill.value.shipping,
                gst:this.formBill.value.gst,
                user_name: this.users.user_name,
                tier_id: this.data.tier_id,
                remarks: this.formBill.value.remarks,
                sales: this.saleItems
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
    addSalesQuotationDetails() {
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
        this.salesDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
        this.availableItemById = 0;
        this.calculate();
        this.clearSalesDetailsForm();
    }
    fillForm() {
            this.totalPrice = this.data.amount,
            this.Qty = this.data.qty,
            this.grandDueTotal = this.data.amount,
            this.totalDue = this.data.total_due,
            this.shippingPayment = this.data.shipping,
            this.gst = this.data.gst,
            this.users.user_name = this.data.user_name,
            this.remarks = this.data.remarks
    }
    getItemsBySalesQuotationId() {
        this.salesDataSource = [];
        this.salesQuotationDetailsService.getItemsBySalesQuotationId(this.data.id).subscribe(
            (response) => {
                this.saleItems.push(...response)
                this.calculate();
                this.salesDataSource = new MatTableDataSource<IItemSupplierData>(response);
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

    removeSalesQuotationDetails(itemId: number): void {
        const filteredItems = this.saleItems.filter(x => +x.item_id !== itemId);
        this.saleItems = filteredItems;
        this.calculate();
        this.salesDataSource = new MatTableDataSource<IItemSupplierData>(this.saleItems);
    }

    clearSalesDetailsForm(): void {
        this.formSupplier.patchValue({
            item_id: '',
            qty: '',
            selling_price: '',
        });
    }
    // getSalesById() {
    //     this.salesService.getSalesById(this.data.id).subscribe(
    //         (response) => {
    //             this.salesData = response[0]
    //             this.lastBillNo = this.salesData.bill_no;
    //             this.formBill.value.remarks = this.salesData.remarks;
    //             if (this.salesData.other_payment) {
    //                 this.isShowOtherPayment = true;
    //             }
    //             this.formBill.patchValue({
    //                 payment: this.salesData.payment,
    //                 otherPayment: this.salesData.other_payment
    //             });
    //             this.calculate();
    //         },
    //         (error) => {
    //             this.snackBar.open(error.error.message || error.message, 'Ok', {
    //                 duration: 3000
    //             });
    //         },
    //         () => { }
    //     );
    // }



    getItemWiseTotal() {
        if (this.formSupplier.value.qty !== '') {
            return (+this.formSupplier.value.qty * +this.formSupplier.value.selling_price)
        }
        return 0;
    }


    hideShowGst() {
        if (this.isShippingChecked === false) {
            this.isShippingChecked = true
        } else {
            this.isShippingChecked = false;
        }
    }

    calculate() {
        this.totalQty = 0
        this.total = 0;
        this.saleItems.forEach(saleItem => {
            this.totalQty = +this.totalQty + +saleItem.qty;
            this.total = +this.total + (+saleItem.qty * +saleItem.selling_price);
        });
        this.grandDueTotal = (+this.total + +this.lastBillDue);
        this.totalDue = +this.grandDueTotal;

    }
    getTierDropDown() {
        this.tiersService
            .getTierDropDown()
            .subscribe(
                (response) => {
                    this.tires = response.find(x => +x.id === +this.data.tier_id);
                    this.tier = this.tires
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
