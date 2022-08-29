import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guard';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {

        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'user',
                pathMatch: 'full',
            },
            {
                path: 'dashboard',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'user',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./user/user.module').then((m) => m.UserModule)
            },
            {
                path: 'cdf',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./cdf/cdf.module').then((m) => m.CDFModule)
            },
            {
                path: 'customers',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./customers/customers.module').then((m) => m.CustomersModule)
            },
            {

                path: 'items',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./items/items.module').then((m) => m.ItemsModule)
            },
            {
                path: 'sales',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./sales/sales.module').then((m) => m.SalesModule)
            },
            {
                path: 'salesQuotation',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./sales-quotation/sales-quotation.module').then((m) => m.SalesQuotationModule)
            },
            {
                path: 'suppliers',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./suppliers/suppliers.module').then((m) => m.SuppliersModule)
            },

            {
                path: 'purchase',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./purchase/purchase.module').then((m) => m.PurchaseModule)
            },
            {
                path: 'expense',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./expense/expense.module').then((m) => m.ExpenseModule)
            },
            {
                path: 'transfer',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./transfer/transfer.module').then((m) => m.TransferModule)
            },
            {
                path: 'analysis',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./analysis/analysis.module').then((m) => m.AnalysisModule)
            },
            {
                path: 'rojMed',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./roj-med/roj-med.module').then((m) => m.RojMedModule)
            },
            {
                path: 'history',
                canActivate: [AuthGuard],
                loadChildren: () =>
                    import('./history/history.module').then((m) => m.HistoryModule)
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
