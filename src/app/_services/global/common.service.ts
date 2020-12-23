import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public router: Router,
    private titleService: Title,
    private _location: Location
  ) { }

  // Get Parent Route if any
  parentUrl() {
    let pUrl = this.router.url.split('/')[1];
    return pUrl && pUrl !== null && pUrl !== undefined ? pUrl : 'dashboard';
  }

  // Get Child Route if any
  childUrl() {
    let cUrl = this.router.url.split('/')[2];
    return cUrl && cUrl !== null && cUrl !== undefined ? cUrl : '';
  }

  // Set Title
  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  // Uppercase First
  Ucase(name: string) {
    return name && name !== null && name !== undefined ? name.charAt(0).toUpperCase() + name.slice(1) : '';
  }

  backClicked() {
    this._location.back();
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