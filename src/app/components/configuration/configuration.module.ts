import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ApplicationPipeModule } from '../../_common/application-pipe/application-pipe.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { ConfiguationRoutingModule } from './configuration.routing';
import { ConfiguationComponent } from './configuation/configuation.component';
import { VisitorcategoriesListComponent } from './visitorcategories/visitorcategories-list/visitorcategories-list.component';
import { VisitorcategoriesAddComponent } from './visitorcategories/visitorcategories-add/visitorcategories-add.component';
import { VisitorcategoriesEditComponent } from './visitorcategories/visitorcategories-edit/visitorcategories-edit.component';

@NgModule({
  declarations: [
    ConfiguationComponent,
    VisitorcategoriesListComponent,
    VisitorcategoriesAddComponent,
    VisitorcategoriesEditComponent
  ],
  imports: [
    CommonModule,
    ConfiguationRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ApplicationPipeModule
  ]
})
export class ConfigurationModule { }
