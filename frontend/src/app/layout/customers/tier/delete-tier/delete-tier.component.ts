import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TiersService } from '../../services/tiers.service';

@Component({
  selector: 'app-delete-tier',
  templateUrl: './delete-tier.component.html',
  styleUrls: ['./delete-tier.component.scss']
})
export class DeleteTierComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private tiersService: TiersService,
    private dialogRef: MatDialogRef<DeleteTierComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() { }

  removeTiers(): void {
    this.tiersService.removeTiers(this.data).subscribe(
      (response) => {
        this.dialogRef.close({ data: true });
        this.snackBar.open('Tier deleted successfully', 'OK', {
          duration: 3000
        });
      },
      (error) => {
        this.snackBar.open(error.error.message || error.message, 'Ok', {
          duration: 3000
        });
      },
      () => { }
    );
  }

  onDismiss(): void {
    this.dialogRef.close({ data: false });
  }
}
