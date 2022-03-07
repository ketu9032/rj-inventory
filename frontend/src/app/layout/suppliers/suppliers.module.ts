import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SuppliersComponent } from './suppliers.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { AddSuppliersComponent } from './add-suppliers/add-suppliers.component';
import { DeleteSuppliersComponent } from './delete-suppliers/delete-suppliers.component';

@NgModule({
  declarations: [SuppliersComponent, AddSuppliersComponent, DeleteSuppliersComponent],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    SuppliersComponent, AddSuppliersComponent, DeleteSuppliersComponent
  ],
})
export class SuppliersModule { }
