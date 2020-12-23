import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from "ngx-spinner";
import { ApplicationPipeModule } from '../../_common/application-pipe/application-pipe.module';

import { BranchRoutingModule } from './branch.routing';
import { BranchComponent } from './branch/branch.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { BranchAddComponent } from './branch-add/branch-add.component';

@NgModule({
  declarations: [
    BranchComponent,
    BranchListComponent,
    BranchEditComponent,
    BranchAddComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ApplicationPipeModule
  ]
})
export class BranchModule { }
