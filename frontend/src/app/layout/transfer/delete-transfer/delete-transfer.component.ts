import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferService } from '../services/transfer.service';

@Component({
  selector: 'app-delete-transfer',
  templateUrl: './delete-transfer.component.html',
  styleUrls: ['./delete-transfer.component.scss']
})
export class DeleteTransferComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private transferService: TransferService,
    private dialogRef: MatDialogRef<DeleteTransferComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  removeTransfer(): void {
    this.transferService.removeTransfer(this.data).subscribe(
      (response) => {
        this.dialogRef.close({ data: true });
        this.snackBar.open('User deleted successfully', 'OK',{
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
