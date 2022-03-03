import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseQuotationComponent } from './purchase-quotation.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseQuotationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseQuotationRoutingModule {}
