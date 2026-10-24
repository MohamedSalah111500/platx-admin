import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlatformActivityComponent } from "./components/platform-activity/platform-activity.component";
import { SignInLogComponent } from "./components/sign-in-log/sign-in-log.component";

const routes: Routes = [
  { path: "", component: PlatformActivityComponent, pathMatch: "full" },
  { path: "sign-ins", component: SignInLogComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformActivityRoutingModule {}
