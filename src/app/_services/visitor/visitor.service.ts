import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map, timeout } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';
import { Visitor } from './../../_models/visitor';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  getVisitors(queryParams?: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.visitors}`;
    var params = new HttpParams();
    if (queryParams) {
      params = params.append('start', queryParams.start ? queryParams.start : '');
      params = params.append('end', queryParams.end ? queryParams.end : '');
      params = params.append('type', queryParams.type ? queryParams.type : '');
      params = params.append('department', queryParams.department ? queryParams.department : '');
      params = params.append('employee', queryParams.employee ? queryParams.employee : '');
      params = params.append('page', queryParams.page ? queryParams.page : '');
      params = params.append('limit', queryParams.limit ? queryParams.limit : '');
      params = params.append('branch', queryParams.branch ? queryParams.branch : '');
      params = params.append('prefix', queryParams.prefix ? queryParams.prefix : '');
    }
    return this.http.get<Visitor[]>(apiUrl, { params: params })
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  preApproved(visitor: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.visitorsPreApproved}`;
    return this.http.post(apiUrl, visitor)
      .pipe(
        timeout(18000),
        catchError(err => {
          return throwError("Error in Response");
        })
      );
  }

  getVisitor(id, queryParams?: any): Observable<any> {
    var params = new HttpParams();
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.visitorProfile}/${id}`;
    if (queryParams) {
      params = params.append('branch', queryParams.branch ? queryParams.branch : '');
      params = params.append('prefix', queryParams.prefix ? queryParams.prefix : '');
    }
    return this.http.get<Visitor[]>(apiUrl, { params: params })
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  getVisitorByFace(data: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.visitorDetailByFaceData}`;
    return this.http.post(apiUrl, data).pipe(
      timeout(15000),
      catchError(err => {
        return throwError("Error in Response");
      })
    );
  }

  getProfileByContact(contact): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.visitorProfileByContact}/${contact}`;
    return this.http.get(apiUrl)
      .pipe(
        catchError(err => {
          return throwError("Error in Response");
        })
      );
  }

  deleteVisitor(id: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.visitorDelete}/${id}`;
    return this.http.delete<Visitor>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  signOutVisitor(id: any, visitor: Visitor): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.visitorSignOut}/${id}`;
    return this.http.put(apiUrl, visitor).pipe(
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
