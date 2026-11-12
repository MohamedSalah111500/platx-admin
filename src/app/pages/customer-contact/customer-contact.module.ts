import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';


import { UIModule } from '../../shared/ui/ui.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TenantRoutingModule } from './customer-contact-routing.module';
import { CustomerContactComponent } from './components/customer-contact/customer-contact.component';


@NgModule({
  declarations: [CustomerContactComponent],
  imports: [
    CommonModule,
    TenantRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule ,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule,
  ]
})
export class CustomerContactModule { }
