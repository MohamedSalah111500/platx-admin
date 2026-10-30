import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { UIModule } from "src/app/shared/ui/ui.module";
import { ExternalUsageRoutingModule } from "./external-usage-routing.module";
import { ExternalUsageComponent } from "./components/external-usage/external-usage.component";
import { StorageGbPipe } from "src/app/shared/storage/storage-size.pipe";

@NgModule({
  declarations: [ExternalUsageComponent],
  imports: [CommonModule, FormsModule, TranslateModule, UIModule, ExternalUsageRoutingModule, StorageGbPipe],
})
export class ExternalUsageModule {}
