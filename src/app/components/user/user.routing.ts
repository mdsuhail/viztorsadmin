import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'list',
                component: UserListComponent
            },
            {
                path: 'add',
                component: UserAddComponent
            },
            {
                path: 'edit/:id',
                component: UserEditComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'detail/:id',
                component: UserDetailComponent
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }