import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITiersData } from 'src/app/models/tiers';
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
    @Inject(MAT_DIALOG_DATA) public data: ITiersData,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddTierComponent>,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private tiersService: TiersService,
  ) { }

  ngOnInit() {
    this.initializeForm();
    if (this.data && this.data.id) {
      this.fillForm();
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

  updateTier(): void {
    const { code, name } = this.formGroup.value;
    this.tiersService
      .editTiers({
        id: this.data.id,
        code,
        name
      })
      .subscribe(
        (response) => {
          this.snackBar.open('Tier updated successfully', 'OK', {
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
      this.updateTier();
    } else {
      this.saveTier();
    }
  }

  fillForm() {
    const { code: code, name: name } = this.data;
    this.formGroup.patchValue({
      code,
      name
    });
  }
}
