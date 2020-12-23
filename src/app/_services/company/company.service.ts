import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';
import { Company } from '../../_models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  getCompanies(): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.companies}`;
    return this.http.get<Company[]>(apiUrl)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  addCompany(company: Company): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.companies}`;
    return this.http.post<Company>(apiUrl, company).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  getCompany(id: any): Observable<Company> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.companyProfile}/${id}`;
    return this.http.get<Company>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  updateCompany(id: any, company: Company): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.companyProfile}/${id}`;
    return this.http.put(apiUrl, company).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  deleteCompany(id: any): Observable<any> {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.companyDelete}/${id}`;
    return this.http.delete<Company>(apiUrl).pipe(
      tap(),
      catchError(this.handleError)
    );
  }

  validateCompany(data = '') {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.companyValidate}`;
    return this.http.post<Company>(apiUrl, data).pipe(
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
