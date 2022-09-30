import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RojMedRoutingModule } from './roj-med-routing.module';
import { RojMedComponent } from './roj-med.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { SaleDialogComponent } from './sale_dialog/sale_dialog.component';
import { ReceiveDialogComponent } from './receive_dialog/receive_dialog.component';
import { PurchaseDialogComponent } from './purchase_dialog/purchase_dialog.component';
import { ExpenseDialogComponent } from './expense_dialog/expense_dialog.component';
import { TransferDialogComponent } from './transfer_dialog/transfer_dialog.component';
@NgModule({
  declarations: [RojMedComponent, SaleDialogComponent, ReceiveDialogComponent, PurchaseDialogComponent, ExpenseDialogComponent, TransferDialogComponent],
  imports: [
    CommonModule,
    RojMedRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    RojMedComponent
  ],
})
export class RojMedModule { }
