import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExternalUsageComponent } from "./components/external-usage/external-usage.component";

const routes: Routes = [{ path: "", component: ExternalUsageComponent, pathMatch: "full" }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalUsageRoutingModule {}
