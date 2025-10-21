import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgOtpInputModule } from 'ng-otp-input';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './page404/page404.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { VerificationComponent } from './verification/verification.component';
import { Verification2Component } from './verification2/verification2.component';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-carousel-ease';

// Swiper Slider

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [MaintenanceComponent, Page404Component, LockscreenComponent, VerificationComponent, Verification2Component],
  imports: [
    CommonModule,
    ExtrapagesRoutingModule,
    NgOtpInputModule,
    FormsModule,
    CarouselModule
    ]
})
export class ExtrapagesModule { }
