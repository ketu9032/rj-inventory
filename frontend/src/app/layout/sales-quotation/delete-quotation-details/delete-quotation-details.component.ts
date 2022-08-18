import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { salesQuotationDetailsService } from '../services/sales-quotation-details.service';

@Component({
  selector: 'app-delete-quotation-details',
  templateUrl: './delete-quotation-details.component.html',
  styleUrls: ['./delete-quotation-details.component.scss']
})
export class DeleteQuotationDetailsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DeleteQuotationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private salesQuotationDetailsService: salesQuotationDetailsService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log(this.data);

  }

  removeCustomers(): void {
    this.salesQuotationDetailsService.removeSalesQuotationDetail(this.data).subscribe(
      (response) => {
        this.snackBar.open('Sales quotation detail deleted successfully', 'OK',{
          duration: 3000
        });
        this.dialogRef.close(true);
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
