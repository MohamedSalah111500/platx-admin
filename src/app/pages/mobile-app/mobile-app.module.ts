import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { UIModule } from "../../shared/ui/ui.module";
import { MobileAppRoutingModule } from "./mobile-app-routing.module";
import { MobileUpdatePolicyComponent } from "./components/mobile-update-policy/mobile-update-policy.component";

@NgModule({
  declarations: [MobileUpdatePolicyComponent],
  imports: [CommonModule, FormsModule, TranslateModule, UIModule, MobileAppRoutingModule],
})
export class MobileAppModule {}
