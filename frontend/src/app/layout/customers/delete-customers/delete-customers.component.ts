import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomersService } from '../services/customers.service';
import { TiersService } from '../services/tiers.service';

@Component({
  selector: 'app-delete-customers',
  templateUrl: './delete-customers.component.html',
  styleUrls: ['./delete-customers.component.scss']
})
export class DeleteCustomersComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private customersService: CustomersService,
    private dialogRef: MatDialogRef<DeleteCustomersComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  removeCustomers(): void {
    this.customersService.removeCustomers(this.data).subscribe(
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
