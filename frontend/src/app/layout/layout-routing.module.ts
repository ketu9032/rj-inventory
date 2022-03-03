import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'cdf',
        loadChildren: () =>
          import('./cdf/cdf.module').then((m) => m.CDFModule)
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./Customers/customers.module').then((m) => m.CustomersModule)
      },
      {
        path: 'items',
        loadChildren: () =>
          import('./items/items.module').then((m) => m.ItemsModule)
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./sales/sales.module').then((m) => m.SalesModule)
      },
      {
        path: 'salesQuotation',
        loadChildren: () =>
          import('./sales-quotation/sales-quotation.module').then((m) => m.SalesQuotationModule)
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./suppliers/suppliers.module').then((m) => m.SuppliersModule)
      },
      {
        path: 'purchaseQuotation',
        loadChildren: () =>
          import('./purchase-quotation/purchase-quotation.module').then((m) => m.PurchaseQuotationModule)
      },
      {
        path: 'purchase',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'expense',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'transfer',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'analysis',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'rojMed',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'history',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
