import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';
import { Department } from './../../_models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  getDepartments(): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.departments}`;
    return this.http.get<Department[]>(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  addDepartment(department: Department): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.departments}`;
    return this.http.post<Department>(apiUrl, department).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getDepartment(id: any): Observable<Department> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.departmentProfile}/${id}`;
    return this.http.get<Department>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  updateDepartment(id: any, department: Department): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.departmentProfile}/${id}`;
    return this.http.put(apiUrl, department).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  deleteDepartment(id: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.departmentDelete}/${id}`;
    return this.http.delete<Department>(apiUrl).pipe(
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
