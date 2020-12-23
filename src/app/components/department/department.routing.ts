import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { DepartmentComponent } from './department/department.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentAddComponent } from './department-add/department-add.component';
import { DepartmentEditComponent } from './department-edit/department-edit.component';

const routes: Routes = [
    {
        path: 'department',
        component: DepartmentComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'list',
                component: DepartmentListComponent
            },
            {
                path: 'add',
                component: DepartmentAddComponent
            },
            {
                path: 'edit/:id',
                component: DepartmentEditComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentRoutingModule { }