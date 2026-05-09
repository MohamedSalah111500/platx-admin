import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RenewalRequestsComponent } from "./components/renewal-requests/renewal-requests.component";

const routes: Routes = [
  { path: "", component: RenewalRequestsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenewalRequestsRoutingModule {}
