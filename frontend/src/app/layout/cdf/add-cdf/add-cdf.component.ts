import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICdfData } from 'src/app/models/cdf';
import { CdfService } from '../services/cdf.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LowerCasePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
    selector: 'app-add-cdf',
    templateUrl: './add-cdf.component.html',
    styleUrls: ['./add-cdf.component.scss']
})
export class AddCdfComponent implements OnInit {
    formGroup: FormGroup;
    selectedRole: string
    isShowLoader = false;
    references = [{ value: 'Person/Company', id: 1 }, { value: 'Google', id: 2 }, { value: 'IndiaMart', id: 3 }, { value: 'Other', id: 4 }];
    brands: string[] = ['Titan', 'Volga', 'Rolex'];
    platforms: string[] = ['Flipkart', 'Amazon', 'Offline'];
    displayNames: string[] = ['watch', 'bag', 'belt'];


    currentDate = new Date();
    visible = true;
    selectable = true;
    addOnBlur = true;
    isEmailExist: boolean = true;
    isCompanyExist: boolean = true;
    isMobileExist: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ICdfData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddCdfComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,

        private cdfService: CdfService
    ) { }
    ngOnInit() {
        this.initializeForm();
        if (this.data && this.data.id) {
            this.fillForm();
        }
    }
    addBrands(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value).trim()) {
            this.brands.push(value);
        }
        if (input) {
            input.value = '';
        }
    }
    removeBrands(brands): void {
        const index = this.brands.indexOf(brands);
        if (index >= 0) {
            this.brands.splice(index, 1);
        }
    }
    addPlatform(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value).trim()) {
            this.platforms.push(value);
        }
        if (input) {
            input.value = '';
        }
    }
    removePlatform(platforms): void {
        const index = this.platforms.indexOf(platforms);
        if (index >= 0) {
            this.platforms.splice(index, 1);
        }
    }
    addDisplayNameForm(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value).trim()) {
            this.displayNames.push(value);
        }
        if (input) {
            input.value = '';
        }
    }
    removeDisplayName(displayName): void {
        const index = this.displayNames.indexOf(displayName);
        if (index >= 0) {
            this.displayNames.splice(index, 1);
        }
    }

    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', Validators.required],
            company: ['', Validators.required],
            date: ['', Validators.required],
            reference: ['', Validators.required],
            referencePerson: ['', Validators.required],
            brands: [' '],
            displayNames: [' '],
            platforms: [' '],
            other: [' '],
            mobile: ['', Validators.required],
            address: ['', Validators.required],
        });
    }
    saveCdf(): void {
        const { email, name, company, date, reference, referencePerson, other, mobile, address } = this.formGroup.value;
        this.isShowLoader = true;
        this.cdfService
            .addCdf({
                email, name, company, date, reference, referencePerson, brands: this.brands, displayNames: this.displayNames, platforms: this.platforms, other, mobile, address
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Cdf saved successfully', 'OK', {
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
    updateCdf(): void {
        const { email, name, company, date, reference, referencePerson, other, mobile, address } = this.formGroup.value;
        this.isShowLoader = true;
        this.cdfService
            .editCdf({
                id: this.data.id,
                email, name, company, date, reference, referencePerson, brands: this.brands, displayNames: this.displayNames, platforms: this.platforms, other, mobile, address
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Cdf updated successfully', 'OK', {
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
            this.updateCdf();
        } else {
            this.saveCdf();
        }
    }
    fillForm() {
        this.brands = [];
        this.platforms = [];
        this.displayNames = [];

        this.brands = this.data.brands.split(",");
        this.platforms = this.data.platforms.split(",");
        this.displayNames = this.data.display_names.split(",");

        const { email: email, name: name, company: company, date: date, reference: reference,
            reference_person: referencePerson, other: other, mobile: mobile, address: address, } = this.data;
        this.formGroup.patchValue({
            email, name, company, date, reference, referencePerson, other, mobile, address
        });
    }
    onEmailCheck() {
        this.cdfService
            .onCheckEmail({ email: this.formGroup.controls.email.value })
            .subscribe(
                (response: boolean) => {
                    this.isEmailExist = response
                })
    }
    onCompanyCheck() {
        this.cdfService
            .onCheckCompany({ company: this.formGroup.controls.company.value })
            .subscribe(
                (response: boolean) => {
                    this.isCompanyExist = response
                })
    }
    onMobileCheck() {
        this.cdfService
            .onCheckMobile({ mobile: this.formGroup.controls.mobile.value })
            .subscribe(
                (response: boolean) => {
                    this.isMobileExist = response
                })
    }
}
