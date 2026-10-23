import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MobileUpdatePolicyComponent } from "./components/mobile-update-policy/mobile-update-policy.component";

const routes: Routes = [{ path: "", component: MobileUpdatePolicyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileAppRoutingModule {}
