import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefaultComponent } from "./dashboards/default/default.component";

const routes: Routes = [
  { path: "dashboard", component: DefaultComponent },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "manage",
    loadChildren: () =>
      import("./manage/manage.module").then((m) => m.ManageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
