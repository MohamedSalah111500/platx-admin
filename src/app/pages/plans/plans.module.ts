import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';


import { UIModule } from '../../shared/ui/ui.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AddEditComponent } from './components/add-edit/add-edit.component';
import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './components/plans/plans.component';


@NgModule({
  declarations: [PlansComponent, AddEditComponent],
  imports: [
    CommonModule,
    PlansRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule ,
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule
  ]
})
export class PlansModule { }
