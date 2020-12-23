import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { VisitorComponent } from './visitor/visitor.component';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { VisitorAddComponent } from './visitor-add/visitor-add.component';
import { VisitorEditComponent } from './visitor-edit/visitor-edit.component';
import { VisitorRoutingModule } from './visitor.routing';
import { ApplicationPipeModule } from '../../_common/application-pipe/application-pipe.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { VisitorDetailComponent } from './visitor-detail/visitor-detail.component';
import { VisitorPassComponent } from './visitor-pass/visitor-pass.component';
import { VisitorListDashboardComponent } from './visitor-list-dashboard/visitor-list-dashboard.component';
import { VisitorPreApprovedComponent } from './visitor-pre-approved/visitor-pre-approved.component';
// import { WebcamModule } from 'ngx-webcam';
// import { CameraComponent } from './../../camera/camera.component';

@NgModule({
  declarations: [
    VisitorComponent,
    VisitorListComponent,
    VisitorAddComponent,
    VisitorEditComponent,
    VisitorDetailComponent,
    VisitorPassComponent,
    VisitorListDashboardComponent,
    VisitorPreApprovedComponent,
    // CameraComponent
  ],
  imports: [
    CommonModule,
    VisitorRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ApplicationPipeModule,
    // WebcamModule
  ],
  exports: [
    VisitorListComponent,
    VisitorListDashboardComponent,
    // CameraComponent
  ]
})
export class VisitorModule { }
