import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DestinationOverviewComponent } from './destination-overview/destination-overview.component';

const routes: Routes = [
  {path: '', component: DestinationOverviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }