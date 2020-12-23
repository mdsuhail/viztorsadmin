import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';
import { Employee } from './../../_models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  getEmployees(): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employees}`;
    return this.http.get<Employee[]>(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  getEmployeesByDepartmentId(id): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employees}/${id}` + '/department';
    return this.http.get<Employee[]>(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  addEmployee(employee: Employee): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employees}`;
    return this.http.post<Employee>(apiUrl, employee).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  addEmployees(employee: Employee): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employeesImport}`;
    return this.http.post<Employee>(apiUrl, employee).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getEmployee(id: any): Observable<Employee> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employeeProfile}/${id}`;
    return this.http.get<Employee>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getEmployeeByEmail(email: any): Observable<Employee> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employeeProfileByEmail}/${email}`;
    return this.http.get<Employee>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  updateEmployee(id: any, employee: Employee): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employeeProfile}/${id}`;
    return this.http.put(apiUrl, employee).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  deleteEmployee(id: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employeeDelete}/${id}`;
    return this.http.delete<Employee>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  validateBranchEmployee(queryParams?: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employees}` + '/validation';
    var params = new HttpParams();
    if (queryParams) {
      params = params.append('company', queryParams.company ? queryParams.company : '');
      params = params.append('prefix', queryParams.branch ? queryParams.branch : '');
      params = params.append('email', queryParams.email ? queryParams.email : '');
    }
    return this.http.get(apiUrl, { params: params })
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  updateEmployeeVerificationStatus(data?: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.employees}` + '/validation/status/update';
    var params = new HttpParams();
    if (data) {
      params = params.append('company', data.company ? data.company : '');
      params = params.append('prefix', data.branch ? data.branch : '');
    }
    return this.http.put(apiUrl, data, { params: params })
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
