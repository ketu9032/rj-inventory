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
    isShowLoader = false;
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
        });
    }
    saveTier(): void {
        this.isShowLoader = true;
        const { code } = this.formGroup.value;
        this.tiersService
            .addTiers({
                code
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Tier saved successfully', 'OK', {
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
    updateTier(): void {
        const { code } = this.formGroup.value;
        this.isShowLoader = true;
        this.tiersService
            .editTiers({
                id: this.data.id,
                code
            })
            .subscribe(
                (response) => {
                    this.isShowLoader = false;
                    this.snackBar.open('Tier updated successfully', 'OK', {
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
            this.updateTier();
        } else {
            this.saveTier();
        }
    }
    fillForm() {
        const { code: code } = this.data;
        this.formGroup.patchValue({
            code,
        });
    }
}
