import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrmLeadsComponent } from "./components/crm-leads/crm-leads.component";
import { CrmLeadDetailsComponent } from "./components/crm-lead-details/crm-lead-details.component";
import { CrmPipelineComponent } from "./components/crm-pipeline/crm-pipeline.component";
import { CrmAgentsComponent } from "./components/crm-agents/crm-agents.component";
import { crmSuperAdminGuard } from "./guards/crm-super-admin.guard";

const routes: Routes = [
  { path: "", redirectTo: "leads", pathMatch: "full" },
  { path: "leads", component: CrmLeadsComponent },
  { path: "leads/:id", component: CrmLeadDetailsComponent },
  { path: "pipeline", component: CrmPipelineComponent },
  { path: "team", component: CrmAgentsComponent, canActivate: [crmSuperAdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrmRoutingModule {}
