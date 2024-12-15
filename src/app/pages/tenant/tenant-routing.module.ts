import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddEditComponent } from "./components/add-edit/add-edit.component";
import { TenantComponent } from "./components/tenant/tenant.component";

const routes: Routes = [
  {
    path: "",
    component: TenantComponent,
  },
  {
    path: "add-edit",
    component: AddEditComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TenantRoutingModule {}
