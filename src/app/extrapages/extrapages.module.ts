import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgOtpInputModule } from 'ng-otp-input';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { Lockscreen2Component } from './lockscreen2/lockscreen2.component';
import { ConfirmmailComponent } from './confirmmail/confirmmail.component';
import { Confirmmail2Component } from './confirmmail2/confirmmail2.component';
import { VerificationComponent } from './verification/verification.component';
import { Verification2Component } from './verification2/verification2.component';
import { SteptwoverificationComponent } from './steptwoverification/steptwoverification.component';
import { Steptwoverification2Component } from './steptwoverification2/steptwoverification2.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-carousel-ease';

// Swiper Slider

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [MaintenanceComponent, Page404Component, Page500Component, LockscreenComponent, Lockscreen2Component, ConfirmmailComponent, Confirmmail2Component, VerificationComponent, Verification2Component, SteptwoverificationComponent, Steptwoverification2Component],
  imports: [
    CommonModule,
    ExtrapagesRoutingModule,
    NgOtpInputModule,
    FormsModule,
    CarouselModule
    ]
})
export class ExtrapagesModule { }
