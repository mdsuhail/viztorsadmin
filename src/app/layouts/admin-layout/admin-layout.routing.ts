import { Routes } from '@angular/router';

//import { LoginComponent } from '../../login/login.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { UserComponent } from '../../components/user/user/user.component';
//import { VisitorComponent } from '../../components/visitor/visitor/visitor.component';
import { CompanyComponent } from '../../components/company/company/company.component';
import { DepartmentComponent } from '../../components/department/department/department.component';
import { ErrorModule } from '../../components/error/error.module';
import { FeaturesComponent } from '../../features/features.component';
//import { ConfiguationComponent } from '../../components/configuration/configuation/configuation.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
//import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    //{ path: 'login',      component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'company', component: CompanyComponent },
    //{ path: 'visitor', component: VisitorComponent },
    { path: 'department', component: DepartmentComponent },
    { path: 'user', component: UserComponent },
    { path: 'error', component: ErrorModule },
    { path: 'profile', component: UserProfileComponent },
    { path: 'features', component: FeaturesComponent },
    //{ path: 'config', component: ConfiguationComponent },
    //{ path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
    { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    //{ path: 'maps',           component: MapsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
];
