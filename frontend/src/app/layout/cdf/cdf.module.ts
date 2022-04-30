import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CDFRoutingModule } from './cdf-routing.module';
import { CDFComponent } from './cdf.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { AddCdfComponent } from './add-cdf/add-cdf.component';
import { DeleteCdfComponent } from './delete-cdf/delete-cdf.component';
import { MatChipsModule } from '@angular/material/chips';
import { CdfToCustomersComponent } from './cdf-to-customers/cdf-to-customers.component';

@NgModule({
  declarations: [CDFComponent,AddCdfComponent,  DeleteCdfComponent, CdfToCustomersComponent],
  imports: [
    CommonModule,
    CDFRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatChipsModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    CDFComponent,
  ],
})
export class CDFModule { }
