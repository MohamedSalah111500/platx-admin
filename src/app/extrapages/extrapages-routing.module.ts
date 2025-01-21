import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './page404/page404.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { VerificationComponent } from './verification/verification.component';
import { Verification2Component } from './verification2/verification2.component';

const routes: Routes = [
    {
        path: 'maintenance',
        component: MaintenanceComponent
    },
    {
        path: '404',
        component: Page404Component
    },

    {
        path: 'lock-screen-1',
        component: LockscreenComponent
    },
    {
        path: 'email-verification',
        component: VerificationComponent
    },
    {
        path: 'email-verification-2',
        component: Verification2Component
    },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ExtrapagesRoutingModule { }
