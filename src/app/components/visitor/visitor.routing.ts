import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { VisitorComponent } from './visitor/visitor.component';
import { VisitorListComponent } from './visitor-list/visitor-list.component';
import { VisitorAddComponent } from './visitor-add/visitor-add.component';
import { VisitorEditComponent } from './visitor-edit/visitor-edit.component';
import { VisitorPassComponent } from './visitor-pass/visitor-pass.component';
import { VisitorPreApprovedComponent } from './visitor-pre-approved/visitor-pre-approved.component';

const routes: Routes = [
    {
        path: 'visitor',
        component: VisitorComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'list',
                component: VisitorListComponent
            },
            {
                path: 'add',
                component: VisitorAddComponent
            },
            {
                path: 'edit/:id',
                component: VisitorEditComponent
            },
            {
                path: 'pass/:id',
                component: VisitorPassComponent
            },
            {
                path: 'preapproved',
                component: VisitorPreApprovedComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisitorRoutingModule { }