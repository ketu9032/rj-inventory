import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICustomersData } from 'src/app/models/customers';
import { CDFService } from '../services/cdf.service';

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
    ListOfSites = [{ value: 'Flipkart', id: 1 }, { value: 'Snapdeal', id: 2 }, { value: 'Amazon', id: 3 }, { value: 'Paytm', id: 4 }, { value: 'Limeraod', id: 5 }, { value: 'Shopclues', id: 6 }, { value: 'Facebook/Instagram', id: 7 }, { value: 'Offline', id: 8 }];



    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ICustomersData,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddCdfComponent>,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private router: Router,
        private cdfService: CDFService
    ) { }

    ngOnInit() {
        this.initializeForm();
        if (this.data && this.data.id) {
            this.fillForm();
        }


    }

    initializeForm(): void {
        this.formGroup = this.formBuilder.group({
            email: ['', Validators.required],
            firstName: ['', Validators.required],
            company: ['', Validators.required],
            date: ['', Validators.required],
            reference: ['', Validators.required],
            referencePerson: ['', Validators.required],
            listOfBrands: ['', Validators.required],
            listOfDisplayNames: ['', Validators.required],
            ListOfSites: ['', Validators.required],
            other: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            address: ['', Validators.required],
        });
    }

    saveUser(): void {
        const { email, firstName, company, date, reference, referencePerson, listOfBrands, listOfDisplayNames, ListOfSites,
            other, mobileNumber, address } = this.formGroup.value;
        this.isShowLoader = true;


        this.cdfService
            .addCdf({
                email, firstName, company, date, reference, referencePerson, listOfBrands, listOfDisplayNames, ListOfSites,
                other, mobileNumber, address


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

    updateCustomers(): void {
        const { email, firstName, company, date, reference, referencePerson, listOfBrands, listOfDisplayNames, ListOfSites,
            other, mobileNumber, address } = this.formGroup.value;
        this.isShowLoader = true;

        this.cdfService
            .editCdf({
                id: this.data.id,
                email, firstName, company, date, reference, referencePerson, listOfBrands, listOfDisplayNames, ListOfSites,
                other, mobileNumber, address
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
            this.updateCustomers();
        } else {
            this.saveUser();
        }
    }

    fillForm() {
        const { company: company, first_name: firstName, address: address, email: email, mobile_no: mobileNumber, due_limit: dueLimit, balance: balance, other: other, tier_id: tierId } = this.data;
        this.formGroup.patchValue({
            company,
            firstName,
            address,
            email,
            mobileNumber,
            dueLimit,
            balance,
            other,
            tier: tierId
        });
    }


}
