import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TransferRoutingModule } from './transfer-routing.module';
import { TransferComponent } from './transfer.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { AddTransferComponent } from './add-transfer/add-transfer.component';
import { DeleteTransferComponent } from './delete-transfer/delete-transfer.component';

@NgModule({
  declarations: [TransferComponent, AddTransferComponent, DeleteTransferComponent],
  imports: [
    CommonModule,
    TransferRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    TransferComponent, AddTransferComponent, DeleteTransferComponent
  ],
})
export class TransferModule { }
