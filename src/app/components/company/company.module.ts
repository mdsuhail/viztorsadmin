import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import { ApplicationPipeModule } from '../../_common/application-pipe/application-pipe.module';

import { CompanyRoutingModule } from './company.routing';
import { CompanyComponent } from './company/company.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyAddComponent } from './company-add/company-add.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyListComponent,
    CompanyAddComponent,
    CompanyEditComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ApplicationPipeModule
  ]
})
export class CompanyModule { }
