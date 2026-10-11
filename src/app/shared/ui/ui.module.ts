import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TranslateModule } from "@ngx-translate/core";

import { PagetitleComponent } from "./pagetitle/pagetitle.component";
import { LoaderComponent } from "./loader/loader.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { ConfirmModelComponent } from "./confirm-model/confirm-model.component";
import { EnvSwitcherComponent } from "./env-switcher/env-switcher.component";
import { LoadErrorComponent } from "./load-error/load-error.component";
@NgModule({
  declarations: [
    PagetitleComponent,
    LoaderComponent,
    SpinnerComponent,
    ConfirmModelComponent,
    EnvSwitcherComponent,
    LoadErrorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TranslateModule,
  ],
  exports: [
    PagetitleComponent,
    LoaderComponent,
    SpinnerComponent,
    ConfirmModelComponent,
    EnvSwitcherComponent,
    LoadErrorComponent,
  ],
})
export class UIModule {}
