import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { salesQuotationDetailsService } from '../services/sales-quotation-details.service';
import { salesQuotationService } from '../services/sales-quotation.service';

@Component({
  selector: 'app-delete-quotation',
  templateUrl: './delete-quotation.component.html',
  styleUrls: ['./delete-quotation.component.scss']
})
export class DeleteQuotationComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<DeleteQuotationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private salesQuotationDetailsService: salesQuotationDetailsService,
    private salesQuotationService: salesQuotationService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {

  }

  removeCustomers(): void {
    this.salesQuotationService.removeSalesQuotation(this.data).subscribe(
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
