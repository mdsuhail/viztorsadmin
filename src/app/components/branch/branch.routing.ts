import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { BranchComponent } from './branch/branch.component';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { BranchAddComponent } from './branch-add/branch-add.component';

const routes: Routes = [
    {
        path: 'branch',
        component: BranchComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'list',
                component: BranchListComponent
            },
            {
                path: 'add',
                component: BranchAddComponent
            },
            {
                path: 'edit/:id',
                component: BranchEditComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BranchRoutingModule { }