import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { ConfiguationComponent } from './configuation/configuation.component';
import { VisitorcategoriesListComponent } from './visitorcategories/visitorcategories-list/visitorcategories-list.component';
import { VisitorcategoriesAddComponent } from './visitorcategories/visitorcategories-add/visitorcategories-add.component';
import { VisitorcategoriesEditComponent } from './visitorcategories/visitorcategories-edit/visitorcategories-edit.component';

const routes: Routes = [
    {
        path: 'visitorcategories',
        component: ConfiguationComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'list',
                component: VisitorcategoriesListComponent
            },
            {
                path: 'add',
                component: VisitorcategoriesAddComponent
            },
            {
                path: 'edit/:id',
                component: VisitorcategoriesEditComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfiguationRoutingModule { }