import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, UrlTree, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { MessageConstants } from '../_common/constants/message';
import { AuthenticateService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(public authService: AuthenticateService, public router: Router, private toastr: ToastrService, private location: Location) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
	const access_token = route.queryParams.access_token;
	if (access_token) {
      const local_access_token = localStorage.getItem('access_token')
      if (local_access_token !== '' || local_access_token !== undefined || local_access_token !== null)
        localStorage.setItem('access_token', access_token)
    }
    if (this.authService.isLoggedIn !== true) {
      // this.toastr.error(MessageConstants.mustLogin, 'Error', { timeOut: 4000 })
      this.router.navigate(['login'])
      return false;
    }
    return true;
  }
}