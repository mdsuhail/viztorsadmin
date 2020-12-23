import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';

@Injectable({
  providedIn: 'root'
})

export class OtpService {
  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  send(queryParams: any) {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.otpSendForEmployeeValidation}`;
    var params = new HttpParams();
    if (queryParams) {
      params = params.append('comp_id', queryParams.comp_id ? queryParams.comp_id : '');
      params = params.append('company', queryParams.company ? queryParams.company : '');
      params = params.append('prefix', queryParams.branch ? queryParams.branch : '');
      params = params.append('type', queryParams.type ? queryParams.type : '');
      params = params.append('contact', queryParams.contact ? queryParams.contact : '');
    }
    return this.http.get(apiUrl, { params: params })
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  verify(queryParams: any) {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.otpVerifyForEmployeeValidation}`;
    var params = new HttpParams();
    if (queryParams) {
      params = params.append('comp_id', queryParams.comp_id ? queryParams.comp_id : '');
      params = params.append('company', queryParams.company ? queryParams.company : '');
      params = params.append('prefix', queryParams.branch ? queryParams.branch : '');
      params = params.append('contact', queryParams.contact ? queryParams.contact : '');
      params = params.append('otp', queryParams.otp ? queryParams.otp : '');
    }
    return this.http.get(apiUrl, { params: params })
      .pipe(
        tap(),
        catchError(this.handleError)
      );
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
