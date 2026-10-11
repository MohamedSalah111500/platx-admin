import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './auth-routing';
import { UIModule } from '../shared/ui/ui.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule.forRoot(),
    TranslateModule,
    UIModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
