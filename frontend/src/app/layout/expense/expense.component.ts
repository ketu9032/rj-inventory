import { CategoryComponent } from './cateogry/category.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  ngOnInit() {}

  constructor(public dialog: MatDialog) {}

  openCategory() {
    this.dialog
      .open(CategoryComponent, {
        width: 'auto',
        height: '500px'
      })
      .afterClosed()
      .subscribe((result) => {});
  }
}
