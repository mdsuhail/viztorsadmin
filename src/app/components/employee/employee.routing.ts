import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { EmployeeComponent } from './employee/employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';

const routes: Routes = [
    {
        path: 'employee',
        component: EmployeeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'list',
                component: EmployeeListComponent
            },
            {
                path: 'add',
                component: EmployeeAddComponent
            },
            {
                path: 'edit/:id',
                component: EmployeeEditComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }