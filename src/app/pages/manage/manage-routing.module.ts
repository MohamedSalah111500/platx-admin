import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfileComponent } from "../profile/profile.component";
import { RolesComponent } from "./roles/roles.component";

const routes: Routes = [
  {
    path: "roles",
    component: RolesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
