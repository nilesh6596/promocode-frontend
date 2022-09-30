import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocodeComponent } from './promocode/promocode.component';

const routes: Routes = [
  {
    path: '',
    component: PromocodeComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
