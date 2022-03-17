import {  ItemsCategoriesService } from '../../services/items-categories.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-items-category',
  templateUrl: './delete-items-category.component.html',
  styleUrls: ['./delete-items-category.component.scss']
})
export class DeleteItemsCategoryComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<DeleteItemsCategoryComponent>,
        private itemsCategoriesService: ItemsCategoriesService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() { }

  removeTiers(): void {
    this.itemsCategoriesService.removeCategory(this.data).subscribe(
      (response) => {
        this.dialogRef.close({ data: true });
        this.snackBar.open('Category deleted successfully', 'OK', {
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
