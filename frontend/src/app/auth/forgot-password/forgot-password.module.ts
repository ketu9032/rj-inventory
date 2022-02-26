import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { MaterialModule } from '../../shared/modules/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {}
