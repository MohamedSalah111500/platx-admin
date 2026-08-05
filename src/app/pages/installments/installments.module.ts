import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { UIModule } from "../../shared/ui/ui.module";
import { InstallmentsRoutingModule } from "./installments-routing.module";
import { InstallmentsDashboardComponent } from "./components/installments-dashboard/installments-dashboard.component";

@NgModule({
  declarations: [InstallmentsDashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    InstallmentsRoutingModule,
  ],
})
export class InstallmentsModule {}
