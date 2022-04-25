import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdfService } from '../services/cdf.service';

@Component({
  selector: 'app-delete-cdf',
  templateUrl: './delete-cdf.component.html',
  styleUrls: ['./delete-cdf.component.scss']
})
export class DeleteCdfComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private cdfService: CdfService,
    private dialogRef: MatDialogRef<DeleteCdfComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  removeCustomers(): void {
    this.cdfService.removeCdf(this.data).subscribe(
      (response) => {
        this.dialogRef.close({ data: true });
        this.snackBar.open('Cdf deleted successfully', 'OK',{
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
