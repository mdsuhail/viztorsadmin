import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouteConstants } from '../../_common/constants/route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  currentUserResourcePermissions: any = [];
  isDesktopDevice: boolean = false;

  constructor(
    public router: Router,
    private _location: Location,
    private deviceService: DeviceDetectorService
  ) {
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  get isRoutePermission(): boolean {
    if (!this.isDesktopDevice) return true;
    var currentUrl = this._location.prepareExternalUrl(this._location.path());
    if (currentUrl.indexOf('Android_asset') > 0) {
      let searchStr = '/www';
      currentUrl = currentUrl.slice(currentUrl.indexOf('/www') + searchStr.length);
    }
    if (currentUrl) {
      var urlArr = currentUrl.split('/');
      var resource = RouteConstants[urlArr[1]];
      var action = urlArr[2];
      if (action && action.indexOf('?')) {
        let act = action.split('?');
        action = act[0];
      }
      if (!action) return true;
      action = RouteConstants[action];
      this.currentUserResourcePermissions = JSON.parse(localStorage.getItem('resourcePermissions'));
      var foundResource: any = this.currentUserResourcePermissions.find(function (resourceData: any) {
        return resourceData.resource.name == resource;
      });
      if (!foundResource) return false;
      var resourcePerm = foundResource.permissions;
      if (resourcePerm.find(function (permission: any) { return permission.name == action; })) return true;
      else return false;
    }
    return true;
  }
}
