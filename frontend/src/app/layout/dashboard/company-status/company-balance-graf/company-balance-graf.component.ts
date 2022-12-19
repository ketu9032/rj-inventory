import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-company-balance-graf',
    templateUrl: './company-balance-graf.component.html',
    styleUrls: ['./company-balance-graf.component.scss']
})
export class CompanyBalanceGrafComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<CompanyBalanceGrafComponent>,
        private formBuilder: FormBuilder,

    ) { }
    ngOnInit(): void {

    }
}
