import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomersComponent } from './customers.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { CustomersService } from './services/customers.service';
import { CustomersRoutingModule } from './customers-routing.module';
import { DeleteCustomersComponent } from './delete-customers/delete-customers.component';
import { TierComponent } from './tier/tier.component';
import { AddTierComponent } from './tier/add-tier/add-tier.component';
import { DeleteTierComponent } from './tier/delete-tier/delete-tier.component';

@NgModule({
  declarations: [CustomersComponent, AddCustomersComponent, DeleteCustomersComponent, TierComponent, AddTierComponent, DeleteTierComponent],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    AddCustomersComponent, DeleteCustomersComponent, TierComponent, AddTierComponent, DeleteTierComponent],
  providers: [CustomersService]
})
export class CustomersModule { }
