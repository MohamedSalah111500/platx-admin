import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { TooltipModule } from "ngx-bootstrap/tooltip";

import { UIModule } from "src/app/shared/ui/ui.module";
import { PlatformActivityRoutingModule } from "./platform-activity-routing.module";
import { PlatformActivityComponent } from "./components/platform-activity/platform-activity.component";

@NgModule({
  declarations: [PlatformActivityComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TooltipModule.forRoot(),
    UIModule,
    PlatformActivityRoutingModule,
  ],
})
export class PlatformActivityModule {}
