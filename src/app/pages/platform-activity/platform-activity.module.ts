import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PaginationModule } from "ngx-bootstrap/pagination";

import { UIModule } from "src/app/shared/ui/ui.module";
import { PlatformActivityRoutingModule } from "./platform-activity-routing.module";
import { PlatformActivityComponent } from "./components/platform-activity/platform-activity.component";
import { SignInLogComponent } from "./components/sign-in-log/sign-in-log.component";

@NgModule({
  declarations: [PlatformActivityComponent, SignInLogComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    UIModule,
    PlatformActivityRoutingModule,
  ],
})
export class PlatformActivityModule {}
