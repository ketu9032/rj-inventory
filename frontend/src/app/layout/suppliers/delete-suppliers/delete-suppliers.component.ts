import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuppliersService } from '../services/suppliers.service';

@Component({
  selector: 'app-delete-suppliers',
  templateUrl: './delete-suppliers.component.html',
  styleUrls: ['./delete-suppliers.component.scss']
})
export class DeleteSuppliersComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private suppliersService: SuppliersService,
    private dialogRef: MatDialogRef<DeleteSuppliersComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  removeSuppliers(): void {
    this.suppliersService.removeSuppliers(this.data).subscribe(
      (response) => {
        this.dialogRef.close({ data: true });
        this.snackBar.open('Suppliers deleted successfully', 'OK',{
          duration: 3000
        });
      },
      (error) => {
        this.snackBar.open(error.error.message || error.message, 'Ok',{
          duration: 3000
        });
      },
      () => {}
    );
  }

  onDismiss(): void {
    this.dialogRef.close({ data: false });
  }
}
