import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../shared/modules/material/material.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { NavComponent } from './nav/nav.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { TopNavModule } from './components/topnav/topnav.module';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule,
    TranslateModule,
    TopNavModule
  ],
  declarations: [
    LayoutComponent,
    NavComponent,
    SidebarComponent,
    TopnavComponent,
  ]
})
export class LayoutModule {}
