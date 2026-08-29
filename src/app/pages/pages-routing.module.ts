import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefaultComponent } from "./dashboards/default/default.component";

const routes: Routes = [
  { path: "dashboard", component: DefaultComponent },

  {
    path: "manage",
    loadChildren: () =>
      import("./manage/manage.module").then((m) => m.ManageModule),
  },
  {
    path: "tenant",
    loadChildren: () =>
      import("./tenant/tenant.module").then((m) => m.TenantModule),
  },
  {
    path: "customer-contact",
    loadChildren: () =>
      import("./customer-contact/customer-contact.module").then(
        (m) => m.CustomerContactModule
      ),
  },

  {
    path: "plans",
    loadChildren: () =>
      import("./plans/plans.module").then((m) => m.PlansModule),
  },
  {
    path: "renewal-requests",
    loadChildren: () =>
      import("./renewal-requests/renewal-requests.module").then(
        (m) => m.RenewalRequestsModule
      ),
  },
  {
    path: "crm",
    loadChildren: () => import("./crm/crm.module").then((m) => m.CrmModule),
  },
  {
    path: "installments",
    loadChildren: () =>
      import("./installments/installments.module").then(
        (m) => m.InstallmentsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
