import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { PagetitleComponent } from "./pagetitle/pagetitle.component";
import { LoaderComponent } from "./loader/loader.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { ConfirmModelComponent } from "./confirm-model/confirm-model.component";
import { EmptyStateComponent } from "./empty-state/empty-state.component";
@NgModule({
  declarations: [
    PagetitleComponent,
    LoaderComponent,
    SpinnerComponent,
    ConfirmModelComponent,
    EmptyStateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  exports: [
    PagetitleComponent,
    LoaderComponent,
    SpinnerComponent,
    ConfirmModelComponent,
    EmptyStateComponent,
  ],
})
export class UIModule {}
