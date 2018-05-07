import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {ShareModule} from "../share/share.module";
import {DashboardService} from "./dashboard.service";


const dashboardRoutes: Routes = [
  {path: "" , component: DashboardComponent},
];

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  providers: [DashboardService],
  exports: [RouterModule]
})
export class DashboardModule { }
