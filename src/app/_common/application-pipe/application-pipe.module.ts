import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapitalizePipe } from './../../_common/filters/capitalize.pipe';
import { PermissionPipe } from './../../_common/filters/permission.pipe';
import { ImagePathPipe } from './../../_common/filters/imagepath.pipe';

@NgModule({
  declarations: [
    CapitalizePipe,
    PermissionPipe,
    ImagePathPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CapitalizePipe,
    PermissionPipe,
    ImagePathPipe
  ]
})
export class ApplicationPipeModule { }
