import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PlatformActivityComponent } from "./components/platform-activity/platform-activity.component";

const routes: Routes = [{ path: "", component: PlatformActivityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlatformActivityRoutingModule {}
