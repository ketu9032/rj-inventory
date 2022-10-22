import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisComponent } from './analysis.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { SmartPurchaseComponent } from './smart-purchase/smart-purchase.component';
import { ProfitChartComponent } from './profit-chart/profit-chart.component';
import { SaleChartComponent } from './sale-chart/sale-chart.component';
import { PurchaseChartComponent } from './purchase-chart/purchase-chart.component';


@NgModule({
    declarations: [AnalysisComponent, SmartPurchaseComponent, ProfitChartComponent, SaleChartComponent, PurchaseChartComponent],
    imports: [

        CommonModule,
        AnalysisRoutingModule,
        SharedModule,
        HighchartsChartModule,
        MatCheckboxModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule.withConfig({ addFlexToParent: false })
    ],
    entryComponents: [
        AnalysisComponent
    ],
})
export class AnalysisModule { }
