import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';
import { BranchAddComponent } from 'app/components/branch/branch-add/branch-add.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  getData(params?: any): Observable<any> {
    var paramsQuery = '';
    if (params)
      paramsQuery = '?branch=' + params.branch + '&prefix=' + params.prefix;
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.dashboard}` + paramsQuery;
    return this.http.get(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  signinChartData(startDate?: string, endDate?: string, params?: any): Observable<any> {
    var apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.signinChart}`;
    if ((startDate !== undefined && endDate !== undefined) || params)
      apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.signinChart}?start=${startDate}&end=${endDate}&branch=${params.branch}&prefix=${params.prefix}`;
    return this.http.get(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  signoutChartData(startDate?: string, endDate?: string, params?: any): Observable<any> {
    var apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.signoutChart}`;
    if ((startDate !== undefined && endDate !== undefined) || params)
      apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.signoutChart}?start=${startDate}&end=${endDate}&branch=${params.branch}&prefix=${params.prefix}`;
    return this.http.get(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  back() {
    this._location.back();
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
