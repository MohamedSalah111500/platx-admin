import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

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
import { ImageUploadComponent } from 'src/app/shared/components/image-upload/image-upload.component';
import { SubscriptionSectionComponent } from './components/subscription-section/subscription-section.component';
import { TenantSubscriptionComponent } from './components/tenant-subscription/tenant-subscription.component';
import { InstallmentsSectionComponent } from './components/installments-section/installments-section.component';


@NgModule({
  declarations: [TenantComponent, AddEditComponent,FileUploadComponent,ImageUploadComponent, SubscriptionSectionComponent, TenantSubscriptionComponent, InstallmentsSectionComponent],
  imports: [
    CommonModule,
    TenantRoutingModule,
    WidgetModule,
    UIModule,
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
