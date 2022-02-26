import { NgModule } from '@angular/core';
import { UserService } from './services/user.service';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/material/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddUserComponent } from './add-user/add-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';

@NgModule({
  declarations: [UserComponent, AddUserComponent, DeleteUserComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatCheckboxModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),
    UserRoutingModule
  ],
  entryComponents: [AddUserComponent, DeleteUserComponent],
  providers: [UserService]
})
export class UserModule {}
