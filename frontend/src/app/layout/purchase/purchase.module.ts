import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { AddPurchaseComponent } from './add-purchase/add-purchase.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PrintComponent } from './print/print.component';

@NgModule({
    declarations: [PurchaseComponent, AddPurchaseComponent, PrintComponent],
    imports: [
        CommonModule,
        PurchaseRoutingModule,
        SharedModule,
        MatCheckboxModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        MatInputModule,
        MatFormFieldModule,
        FlexLayoutModule.withConfig({ addFlexToParent: false })
    ],
    entryComponents: [
        PurchaseComponent,

    ],
})
export class PurchaseModule { }
