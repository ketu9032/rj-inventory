import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private userService: UserService,
    private dialogRef: MatDialogRef<DeleteUserComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  removeUser(): void {
    this.userService.removeUser(this.data).subscribe(
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
