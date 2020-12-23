import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';

import { DepartmentComponent } from './department/department.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentAddComponent } from './department-add/department-add.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';
import { DepartmentRoutingModule } from './department.routing';
import { ApplicationPipeModule } from '../../_common/application-pipe/application-pipe.module';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    DepartmentComponent,
    DepartmentListComponent,
    DepartmentAddComponent,
    DepartmentEditComponent
  ],
  imports: [
    CommonModule,
    DepartmentRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ApplicationPipeModule
  ]
})
export class DepartmentModule { }
