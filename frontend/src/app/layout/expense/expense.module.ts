import { DeleteCategoryComponent } from './cateogry/delete-category/delete-category.component';
import { AddCategoryComponent } from './cateogry/add-category/add-category.component';
import { CategoryComponent } from './cateogry/category.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseComponent } from './expense.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { AddExpenseComponent } from './add-expense/add-expense.component';

@NgModule({
  declarations: [
    ExpenseComponent,
    AddExpenseComponent,
    CategoryComponent,
    AddCategoryComponent,
    DeleteCategoryComponent
  ],
  imports: [
    CommonModule,
    ExpenseRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    CategoryComponent,
    AddCategoryComponent,
    DeleteCategoryComponent
  ]
})
export class ExpenseModule {}
