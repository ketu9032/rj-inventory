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
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'salesQuotation',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'purchaseQuotation',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
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
