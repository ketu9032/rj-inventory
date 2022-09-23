import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-confirm-box',
    templateUrl: './confirm-box.component.html',
    styleUrls: ['./confirm-box.component.scss']
})
export class ConfirmBoxComponent implements OnInit {
    constructor(
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: string,
        private dialogRef: MatDialogRef<ConfirmBoxComponent>,
        public snackBar: MatSnackBar,
    ) { }
    ngOnInit() { }
    saveSales(): void {
        this.dialogRef.close({ data: true });
    }
    onDismiss(): void {
        this.dialogRef.close({ data: false });
    }
}
