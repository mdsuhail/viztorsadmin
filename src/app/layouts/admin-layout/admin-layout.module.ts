import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { UserModule } from '../../components/user/user.module';
import { EmployeeModule } from '../../components/employee/employee.module';
import { CompanyModule } from '../../components/company/company.module';
import { BranchModule } from '../../components/branch/branch.module';
import { DepartmentModule } from '../../components/department/department.module';
import { VisitorModule } from '../../components/visitor/visitor.module';
import { ConfigurationModule } from '../../components/configuration/configuration.module';
import { ErrorModule } from '../../components/error/error.module';
import { FeaturesComponent } from '../../features/features.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    //DashboardComponent,
    UserModule,
    EmployeeModule,
    CompanyModule,
    BranchModule,
    DepartmentModule,
    VisitorModule,
    ConfigurationModule,
    ErrorModule,
    NgxSpinnerModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    FeaturesComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
  ],
})

export class AdminLayoutModule { }
