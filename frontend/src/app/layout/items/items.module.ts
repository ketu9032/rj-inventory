import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { AddItemComponent } from './add-item/add-item.component';
import { AddItemsCategoryComponent } from './cateogry/add-items-category/add-items-category.component';
import { DeleteItemsCategoryComponent } from './cateogry/delete-items-category/delete-items-category.component';
import { ItemsCategoryComponent } from './cateogry/items-category.component';

@NgModule({
  declarations: [ItemsComponent,AddItemComponent,ItemsCategoryComponent,AddItemsCategoryComponent,DeleteItemsCategoryComponent],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    ItemsComponent,AddItemComponent
  ],
})
export class ItemsModule { }
