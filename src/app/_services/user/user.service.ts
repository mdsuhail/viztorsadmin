import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { ApiConstants } from '../../_common/constants/api';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(
    private http: HttpClient,
    private _location: Location,
  ) { }

  registerEmployee(data: any) {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.userRegister}`;
    return this.http.post(apiUrl, data)
      .pipe(
        tap(),
        catchError(this.handleError)
      );
  }

  getUserByEmail(email: any) {
    let apiUrl = `${ApiConstants.baseURL}/${ApiConstants.apiVersion}/${ApiConstants.userProfileByEmail}/${email}`;
    return this.http.get(apiUrl).pipe(
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
