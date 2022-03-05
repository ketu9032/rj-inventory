import { CategoriesService } from './../../services/categories.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.scss']
})
export class DeleteCategoryComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<DeleteCategoryComponent>,
    private categoriesService: CategoriesService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() { }

  removeTiers(): void {
    this.categoriesService.removeCategory(this.data).subscribe(
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
