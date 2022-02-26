import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { RestService } from 'src/app/shared/services/rest.service';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TopNavRoutingModule } from './topnav-routing.module';
import { TopNavService } from './services/topnav.service';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordService } from './services/change-password.service';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    SharedModule,

    HttpClientModule,
    MatCheckboxModule,
    TopNavRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  entryComponents: [ChangePasswordComponent],
  providers: [TopNavService, RestService, ChangePasswordService]
})
export class TopNavModule {}
