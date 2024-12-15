import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TenantRoutingModule } from './tenant-routing.module';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { TenantComponent } from './components/tenant/tenant.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { UiSwitchModule } from 'ngx-ui-switch';


@NgModule({
  declarations: [TenantComponent, AddEditComponent,FileUploadComponent],
  imports: [
    CommonModule,
    TenantRoutingModule,
    WidgetModule,
    UIModule,
    NgSelectModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule ,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule,
    ModalModule,
    DropzoneModule,
    UiSwitchModule
  ]
})
export class TenantModule { }
