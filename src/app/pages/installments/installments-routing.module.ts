import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InstallmentsDashboardComponent } from "./components/installments-dashboard/installments-dashboard.component";

const routes: Routes = [{ path: "", component: InstallmentsDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstallmentsRoutingModule {}
