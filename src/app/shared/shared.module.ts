import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule
  ],
})

export class SharedModule { }
