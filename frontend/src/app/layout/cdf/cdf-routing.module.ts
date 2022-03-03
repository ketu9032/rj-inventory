import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CDFComponent } from './cdf.component';

const routes: Routes = [
  {
    path: '',
    component: CDFComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CDFRoutingModule {}
