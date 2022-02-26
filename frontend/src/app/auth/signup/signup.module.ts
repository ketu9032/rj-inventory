import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SignUpRoutingModule } from './signup-routing.module';
import { SignUpComponent } from './signup.component';
import { MaterialModule } from '../../shared/modules/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    SignUpRoutingModule,
    MaterialModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  declarations: [SignUpComponent]
})
export class SignUpModule {}
