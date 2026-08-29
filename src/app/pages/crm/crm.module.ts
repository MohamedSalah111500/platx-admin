import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PaginationModule } from "ngx-bootstrap/pagination";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";

import { UIModule } from "../../shared/ui/ui.module";
import { CrmRoutingModule } from "./crm-routing.module";

import { CrmLeadsComponent } from "./components/crm-leads/crm-leads.component";
import { CrmLeadDetailsComponent } from "./components/crm-lead-details/crm-lead-details.component";
import { CrmPipelineComponent } from "./components/crm-pipeline/crm-pipeline.component";
import { CrmAgentsComponent } from "./components/crm-agents/crm-agents.component";
import { CrmLeadFormComponent } from "./components/crm-lead-form/crm-lead-form.component";
import { CrmStatusModalComponent } from "./components/crm-status-modal/crm-status-modal.component";
import { CrmImportModalComponent } from "./components/crm-import-modal/crm-import-modal.component";

@NgModule({
  declarations: [
    CrmLeadsComponent,
    CrmLeadDetailsComponent,
    CrmPipelineComponent,
    CrmAgentsComponent,
    CrmLeadFormComponent,
    CrmStatusModalComponent,
    CrmImportModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CrmRoutingModule,
    UIModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
})
export class CrmModule {}
