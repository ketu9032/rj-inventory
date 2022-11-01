import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { DayWiseSaleProfitChartComponent } from './day-wise-sale-profit-chart/day-wise-sale-profit-chart.component';
import { TodaySummaryComponent } from './today-summary/today-summary.component';
import { CustomerSuppliersChartComponent } from './customer-suppliers-chart/customer-suppliers-chart.component';
import { CompanyStatusComponent } from './company-status/company-status.component';

@NgModule({
  declarations: [DashboardComponent,DayWiseSaleProfitChartComponent, TodaySummaryComponent, CustomerSuppliersChartComponent, CompanyStatusComponent ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
