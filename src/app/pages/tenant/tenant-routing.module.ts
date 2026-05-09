import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddEditComponent } from "./components/add-edit/add-edit.component";
import { TenantComponent } from "./components/tenant/tenant.component";
import { TenantSubscriptionComponent } from "./components/tenant-subscription/tenant-subscription.component";

const routes: Routes = [
  {
    path: "",
    component: TenantComponent,
  },
  {
    path: "add-edit",
    component: AddEditComponent,
  },
  {
    path: "subscription/:id",
    component: TenantSubscriptionComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantRoutingModule {}
