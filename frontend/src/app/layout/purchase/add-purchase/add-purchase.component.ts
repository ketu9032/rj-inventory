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
    total: number;
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
    showEditButton: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IPurchaseData,
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
        console.log(this.data)
        this.users = this.authService.getUserData();
        if (this.data.supplierDetails) {
            this.supplierDetails = this.data.supplierDetails[0]
            this.supplierName = this.supplierDetails.company
            this.lastBillDue = this.supplierDetails.balance
            this.dueLimit = this.supplierDetails.due_limit

        }
        this.getItemDropDown()
        this.initializeForm();
        this.initializeSupplierForm();
        this.initializeSalesBillForm()

        if (this.data.id) {
            this.fillForm();
            // this.getItemSupplier();
            this.test();
        }
    }
    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            company: ['', Validators.required],
            date: ['', Validators.required],
            invoice_no: ['', Validators.required]
        });
    }
    initializeSupplierForm(): void {
        this.formSupplier = this.formBuilder.group({
            item_code: ['', Validators.required],
            qty: [''],
            available: [''],
            total: [''],
            selling_price: [''],
        });
    }
    initializeSalesBillForm(): void {
        this.formBill = this.formBuilder.group({
            payment: ['', Validators.required],
            remarks: ['', Validators.required]
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
    updateSalesQuotation(): void {
        const pendingDueTotal = +this.totalPrice + +this.lastBillDue
        this.isShowLoader = true;
        this.purchaseService
            .editPurchase({
                id: this.data.id,
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
        if (this.data.id) {
            this.updateSalesQuotation();
        } else {
            this.savePurchase();
        }

    }

    addAndEditPurchaseDetails(){
        if(this.data.id){
            this.updatePurchaseDetails();
        } else{
          this.addSalesQuotation()
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
        const sale = {
            item_code,
            qty,
            available,
            selling_price,
            total
        }
        this.sales.push(sale)
        this.supplierDataSource = new MatTableDataSource<IItemSupplierData>(this.sales);
        this.clearSupplierForm();

    }

    updatePurchaseDetails(): void {

        const {
            item_code,
            qty,
            available,
            selling_price,
            total
        } = this.formSupplier.value;
        this.purchaseDetailsService
            .editPurchaseDetail({
                id: this.data.id,
                item_code,
                qty,
                available,
                selling_price,
                total,
                purchase_id: +this.data.id


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


    fillForm() {
        const {
            supplier,
            date,
            invoice_no,
        } = this.data;
        this.formGroup.patchValue({
            supplier,
            date,
            invoice_no,
        })
            this.supplierName = this.data.supplier,
            this.totalPrice = this.data.amount,
            this.Qty = this.data.qty
            this.lastBillDue = this.data.pending_due,
            this.totalDue = this.data.total_due,
            this.grandDueTotal = this.data.amount_pd_total,
            this.remarks = this.data.remarks,
            this.currentPayment = this.data.payment,
            this.otherPayment = this.data.other_payment
    }
    supplierFillForm(element) {
    //     const itemSupplierRate = this.sales.find(x => +x.suppliers_id === +suppliersId).item_supplier_rate;
    //     this.formSupplier.patchValue({
    //         salesQuotationId: this.data.id, item_code, item_supplier_rate: itemSupplierRate
    //     });

    if(element.purchase_id) {
      this.showEditButton = true;
    }



    const {
        item_code,
        qty,
        available,
        selling_price,
        total
    } = element;
    this.formSupplier.patchValue({
        item_code,
        qty,
        available,
        selling_price,
        total
    });
     }




    // getPurchaseSupplier() {
    //     this.supplierDataSource = [];
    //     this.suppliers = []
    //     this.tableParams.itemId = this.data.id;
    //     this.purchaseDetailsService.getPurchaseDetail(this.tableParams).subscribe(
    //         (newItemSupplier: any[]) => {
    //             this.suppliers.push(...newItemSupplier);
    //             this.supplierDataSource = new MatTableDataSource<IItemSupplierData>(newItemSupplier);
    //             if (newItemSupplier.length > 0) {
    //                 this.totalRows = newItemSupplier[0].total;
    //             }
    //         },
    //         (error) => {
    //             this.snackBar.open(error.error.message || error.message, 'Ok', {
    //                 duration: 3000
    //             });
    //         },
    //         () => { }
    //     );
    // }
    test() {
        this.supplierDataSource = [];
        this.suppliers = []
        this.tableParams.itemId = this.data.id;
        this.purchaseDetailsService.getPurchaseDetail(this.tableParams).subscribe(
            (response) => {
                this.findPurchaseDetails = response.filter(val => {
                    return (val.purchase_id) === this.data.id
                })
                //  console.log(findPurchaseDetails)
                //   this.supplierDataSource.push(findPurchaseDetails);

                this.supplierDataSource = new MatTableDataSource<IItemSupplierData>(this.findPurchaseDetails);
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
    count() {
        if (this.formSupplier.value.qty !== '') {
            this.total = (this.formSupplier.value.qty * this.formSupplier.value.selling_price)
            this.formSupplier.patchValue({
                total: this.total
            })
        }
    }
    add() {
        this.countQty.push(+this.formSupplier.value.qty)
        this.Qty = this.countQty.reduce((acc, cur) => acc + cur, 0);
        this.countTotal.push(this.total)
        this.totalPrice = this.countTotal.reduce((acc, cur) => acc + Number(cur), 0)
        this.grandDueTotal = (+this.totalPrice + +this.lastBillDue)
    }
    totalPaymentToDueCount() {
        this.totalDue = +this.grandDueTotal - +this.currentPayment
    }
    totalOtherToDueCount() {
        if (this.otherPayment != 0) {
            this.totalDue = +this.totalDue - +this.otherPayment
        }
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
    removePurchaseDetails(element): void {
        this.purchaseDetailsService.removePurchaseDetail(element.id).subscribe(
            (response) => {
                this.test();
            },
            () => { }
        );
    }
    clearSupplierForm(){
        this.formSupplier.patchValue({
            item_code: '',
            qty: '',
            available: '',
            selling_price: '',
            total: ''
        })
    }

}