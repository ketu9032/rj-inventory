import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RojMedComponent } from './roj-med.component';

const routes: Routes = [
  {
    path: '',
    component: RojMedComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RojMedRoutingModule {}
