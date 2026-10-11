import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PagesRoutingModule } from "./pages-routing.module";
import { DashboardsModule } from "./dashboards/dashboards.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, PagesRoutingModule, DashboardsModule],
})
export class PagesModule {}
