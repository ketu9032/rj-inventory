import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopnavComponent } from './topnav.component';

const routes: Routes = [
  {
    path: '',
    component: TopnavComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopNavRoutingModule {}
