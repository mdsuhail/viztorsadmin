import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiConstants } from '../_common/constants/api';
import { MessageConstants } from '../_common/constants/message';
import { RouteConstants } from '../_common/constants/route';
import { NgxSpinnerService } from "ngx-spinner";

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  public currentUser: any;
  currentUserResources: any = [];

  constructor(
    public platform: Platform,
    private http: HttpClient,
    public router: Router,
    private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService,
    private location: Location
  ) { }

  public isAuthenticated(): Boolean {
    let userData = localStorage.getItem('userInfo')
    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  }

  public setAccessToken(token) {
    localStorage.setItem('access_token', token);
  }

  public setUserInfo(detail) {
    localStorage.setItem('user', JSON.stringify(detail.data.user));
    localStorage.setItem('company', JSON.stringify(detail.data.company));
    localStorage.setItem('branch', JSON.stringify(detail.data.branch));
    localStorage.setItem('role', JSON.stringify(detail.data.role));
    localStorage.setItem('resources', JSON.stringify(detail.data.resources));
    localStorage.setItem('resourcePermissions', JSON.stringify(detail.data.resourcePermissions));
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getLocalData(dataKey = '') {
    return localStorage.getItem(dataKey);
  }

  setLocalData(dataKey = '', data: any) {
    return localStorage.setItem(dataKey, JSON.stringify(data));
  }

  // register
  signUp(user: User): Observable<any> {
    let api = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/register`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  // login
  login(user: User): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.userLogin}`;
    return this.http.post(apiUrl, user).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  // loginGoogle
  loginGoogle(user): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.userLoginGoogle}`;
    return this.http.post(apiUrl, user).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  checkBrowser(detail: any) {
    if (detail.data.branch !== null && detail.data.branch.length !== 0) {
      detail.data.branch.isTouchlessData = detail.data.branch.isTouchless
      // if (this.platform.isBrowser) {
      //   detail.data.branch.isTouchless = false
      // }
    }
    this.setUserInfo(detail)
  }

  // User profile
  getUserProfile(id): Observable<any> {
    let api = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.userProfile}/${id}`;
    return this.http.get(api).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    localStorage.removeItem('branch');
    localStorage.removeItem('role');
    localStorage.removeItem('resources');
    localStorage.removeItem('resourcePermissions');
    this.toastr.success(MessageConstants.logout, 'Succeess', { timeOut: 3000 })
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}