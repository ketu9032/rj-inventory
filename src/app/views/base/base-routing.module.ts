import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccordionsComponent } from './accordion/accordions.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base',
    },
    children: [
      {
        path: '',
        redirectTo: 'cards',
      },
      {
        path: 'accordion',
        component: AccordionsComponent,
        data: {
          title: 'Accordion',
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule {}

