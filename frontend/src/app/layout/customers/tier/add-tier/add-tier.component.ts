import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICustomersData } from 'src/app/models/customers';
import { CustomersService } from '../../services/customers.service';
import { TiersService } from '../../services/tiers.service';

@Component({
  selector: 'app-add-tier',
  templateUrl: './add-tier.component.html',
  styleUrls: ['./add-tier.component.scss']
})
export class AddTierComponent implements OnInit {
  formGroup: FormGroup;
  selectedRole: string
  tires = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICustomersData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTierComponent>,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private tiersService: TiersService,
  ) { }

  ngOnInit() {
    this.initializeForm();
  //  this.getTierDropDown();
    if (this.data && this.data.id) {
    //  this.fillForm();
    }
  }

  initializeForm(): void {
    this.formGroup = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      
    });
  }

  saveTier(): void {
    const { code, name } = this.formGroup.value;
    this.tiersService
      .addTiers({
        code,
        name
      })
      .subscribe(
        (response) => {
          this.snackBar.open('Tier saved successfully', 'OK', {
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

  // updateCustomers(): void {
  //   const { company, firstName, address, email, mobileNumber, dueLimit, balance, other, tier: tierId } = this.formGroup.value;
  //   this.customersService
  //     .editCustomers({
  //       id: this.data.id,
  //       company,
  //       firstName,
  //       address,
  //       email,
  //       mobileNumber,
  //       dueLimit,
  //       balance,
  //       other,
  //       tierId
  //     })
  //     .subscribe(
  //       (response) => {
  //         this.snackBar.open('User updated Successfully', 'OK', {
  //           duration: 3000
  //         });
  //         this.dialogRef.close(true);
  //       },
  //       (error) => {
  //         this.snackBar.open(
  //           (error.error && error.error.message) || error.message,
  //           'Ok', {
  //           duration: 3000
  //         }
  //         );
  //       },
  //       () => { }
  //     );
  // }

  onSubmit() {
    if (this.data && this.data.id) {
  //    this.updateCustomers();
    } else {
      this.saveTier();
    }
  }

  // fillForm() {
  //   const { company: company, first_name: firstName, address: address, email: email, mobile_no: mobileNumber, due_limit: dueLimit, balance: balance, other: other, tier_id: tierId } = this.data;
  //   this.formGroup.patchValue({
  //     company,
  //     firstName,
  //     address,
  //     email,
  //     mobileNumber,
  //     dueLimit,
  //     balance,
  //     other,
  //     tier: tierId
  //   });
  // }

  // getTierDropDown() {
  //   this.tiersService
  //     .getTierDropDown()
  //     .subscribe(
  //       (response) => {
  //         this.tires =  response;
  //       },
  //       (error) => {
  //         this.snackBar.open(
  //           (error.error && error.error.message) || error.message,
  //           'Ok', {
  //           duration: 3000
  //         }
  //         );
  //       },
  //       () => { }
  //     );
  // }
}
