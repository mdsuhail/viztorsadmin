import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { CompanyComponent } from './company/company.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyAddComponent } from './company-add/company-add.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'list',
                component: CompanyListComponent
            },
            {
                path: 'add',
                component: CompanyAddComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'edit/:id',
                component: CompanyEditComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }