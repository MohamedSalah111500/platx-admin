import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgApexchartsModule } from 'ng-apexcharts';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgSelectModule } from '@ng-select/ng-select';

import { WidgetModule } from '../../shared/widget/widget.module';
import { UIModule } from '../../shared/ui/ui.module';
import { ContactsRoutingModule } from './profile-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProfileComponent } from './profile.component';
import { QualificationModelComponent } from './components/confirm-model/qualification-model.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [ProfileComponent,QualificationModelComponent],
  imports: [
    CommonModule,
    ContactsRoutingModule,
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
    BsDatepickerModule
  ]
})
export class ProfileModule { }
