import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { superAdminGuard } from "src/app/core/guards/super-admin.guard";
import { AddEditComponent } from "./components/add-edit/add-edit.component";
import { PlansComponent } from "./components/plans/plans.component";

const routes: Routes = [
  {
    path: "",
    component: PlansComponent,
  },
  {
    path: "add-edit",
    component: AddEditComponent,
    canActivate: [superAdminGuard],
  },
  {
    path: "add-edit/:id",
    component: AddEditComponent,
    canActivate: [superAdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlansRoutingModule {}
