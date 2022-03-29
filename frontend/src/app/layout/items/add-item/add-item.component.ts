import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IItemData } from 'src/app/models/item';
import { ItemsCategoriesService } from '../services/items-categories.service';
import { ItemsService } from '../services/items.service';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
    displayedColumns: string[] = [
        'name',
        'qty',
        'action'
    ];
    formGroup: FormGroup;
    selectedRole: string
    tires = []
    isShowLoader = false;
    categories = []
    dataSource: any = [];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IItemData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddItemComponent>,
        private formBuilder: FormBuilder,
        private itemsCategoriesService: ItemsCategoriesService,
        public snackBar: MatSnackBar,
        private router: Router,
        private itemsService: ItemsService
    ) { }

    ngOnInit() {
        this.initializeForm();
        this.getCategoriesDropDown('Item')
        if (this.data && this.data.id) {
            // this.fillForm();
        }
    }

    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            itemCode: ['', Validators.required],
            itemName: ['', Validators.required],
            category: ['', Validators.required],
            comment: ['', Validators.required],
            initQty: ['', Validators.required],
            silver: ['', Validators.required],
            retail: ['', Validators.required],
            gold: ['', Validators.required],
            indiaMart: ['', Validators.required],
            dealer: ['', Validators.required],
            name: ['', Validators.required],
            qty: ['', Validators.required],
        });
    }

    saveItems(): void {
        const { itemCode,
            itemName,
            category,
            comment,
            initQty,
            silver,
            retail,
            gold,
            indiaMart,
            dealer,
        name, qty } = this.formGroup.value;
        this.isShowLoader = true;

        this.itemsService
            .addItems({
                itemCode,
                itemName,
                category,
                comment,
                initQty,
                silver,
                retail,
                gold,
                indiaMart,
                dealer,name, qty
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;

                    this.snackBar.open('User saved successfully', 'OK', {
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
        const { itemCode,
            itemName,
            category,
            comment,
            initQty,
            silver,
            retail,
            gold,
            indiaMart,
            dealer,name, qty } = this.formGroup.value;
        this.isShowLoader = true;

        this.itemsService
            .editItems({
                id: this.data.id,
                itemCode,
                itemName,
                category,
                comment,
                initQty,
                silver,
                retail,
                gold,
                indiaMart,
                dealer,name, qty
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;

                    this.snackBar.open('User updated successfully', 'OK', {
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
    }

    // fillForm() {
    //     const { company: company, first_name: firstName, address: address, mobile_no: mobileNumber, due_limit: dueLimit, balance: balance, other: other, tier_id: tierId } = this.data;
    //     this.formGroup.patchValue({
    //         company,
    //         firstName,
    //         address,
    //
    //         mobileNumber,
    //         dueLimit,
    //         balance,
    //         other,
    //         tier: tierId
    //     });
    // }
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

}
