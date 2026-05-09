import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { UIModule } from "../../shared/ui/ui.module";
import { RenewalRequestsRoutingModule } from "./renewal-requests-routing.module";
import { RenewalRequestsComponent } from "./components/renewal-requests/renewal-requests.component";

@NgModule({
  declarations: [RenewalRequestsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    RenewalRequestsRoutingModule,
  ],
})
export class RenewalRequestsModule {}
