import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';
import { Branch } from '../../_models/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  getBranches(): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.branches}`;
    return this.http.get<Branch[]>(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  addBranch(branch: Branch): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.branches}`;
    return this.http.post<Branch>(apiUrl, branch).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getBranch(id: any): Observable<Branch> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.branchProfile}/${id}`;
    return this.http.get<Branch>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getBranchesByCompanyId(id: any): Observable<Branch> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.branches}/${id}` + '/company';
    return this.http.get<Branch>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getBranchesByCompanyIdForEmployeeValidation(id: any): Observable<Branch> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.branches}/${id}` + '/company/employee/validation';
    return this.http.get<Branch>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  updateBranch(id: any, branch: Branch): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.branchProfile}/${id}`;
    return this.http.put(apiUrl, branch).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  deleteBranch(id: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.branchDelete}/${id}`;
    return this.http.delete<Branch>(apiUrl).pipe(
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
