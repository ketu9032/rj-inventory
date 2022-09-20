import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SalesQuotationRoutingModule } from './sales-quotation-routing.module';
import { SalesQuotationComponent } from './sales-quotation.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { CreateQuotationComponent } from './create-quotation/create-quotation.component';
import { MoveSalesComponent } from './move-sales/move-sales.component';
import { DeleteQuotationComponent } from './delete-quotation/delete-quotation.component';

@NgModule({
  declarations: [SalesQuotationComponent, CreateQuotationComponent, MoveSalesComponent, DeleteQuotationComponent ],

  imports: [
    CommonModule,
    SalesQuotationRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    SalesQuotationComponent
  ],
})
export class SalesQuotationModule { }
