import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'permission' })
export class PermissionPipe implements PipeTransform {
    currentUserResourcePermissions: [];
    transform(resource: string, action: string, test: string): any {
        if (!resource) return false;
        this.currentUserResourcePermissions = JSON.parse(localStorage.getItem('resourcePermissions'));
        var foundResource: any = this.currentUserResourcePermissions.find(function (resourceData: any) {
            return resourceData.resource.name == resource;
        });
        if (!foundResource) return false;
        var resourcePerm = foundResource.permissions;
        if (resourcePerm.find(function (permission: any) { return permission.name == action; })) return true;
        return false;
    }
}
