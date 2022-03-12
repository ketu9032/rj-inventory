import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICustomersData } from 'src/app/models/customers';
import { IUserData } from 'src/app/models/user';
import { CustomersService } from '../services/customers.service';
import { TiersService } from '../services/tiers.service';

@Component({
  selector: 'app-add-customers',
  templateUrl: './add-customers.component.html',
  styleUrls: ['./add-customers.component.scss']
})
export class AddCustomersComponent implements OnInit {
  formGroup: FormGroup;
  selectedRole: string
  tires = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICustomersData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCustomersComponent>,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private router: Router,
    private tiersService: TiersService,
    private customersService: CustomersService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.getTierDropDown();
    if (this.data && this.data.id) {
      this.fillForm();
    }
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      company: ['', Validators.required],
      firstName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      dueLimit: ['', Validators.required],
      balance: ['', Validators.required],
      other: ['', Validators.required],
      tier: ['', Validators.required],
    });
  }

  saveUser(): void {
    const { company, firstName, address, email, mobileNumber, dueLimit, balance, other, tier: tierId } = this.formGroup.value;
    this.customersService
      .addCustomers({
        company,
        firstName,
        address,
        email,
        mobileNumber,
        dueLimit,
        balance,
        other,
        tierId
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User saved successfully', 'OK', {
            duration: 3000
          });
          this.dialogRef.close(true);
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

  updateCustomers(): void {
    const { company, firstName, address, email, mobileNumber, dueLimit, balance, other, tier: tierId } = this.formGroup.value;
    this.customersService
      .editCustomers({
        id: this.data.id,
        company,
        firstName,
        address,
        email,
        mobileNumber,
        dueLimit,
        balance,
        other,
        tierId
      })
      .subscribe(
        (response) => {
          this.snackBar.open('User updated successfully', 'OK', {
            duration: 3000
          });
          this.dialogRef.close(true);
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

  getTierDropDown() {
    this.tiersService
      .getTierDropDown()
      .subscribe(
        (response) => {
          this.tires =  response;
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
