import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, take, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ApiConstants } from '../../../_common/constants/api';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  companies: [];
  companiesTotal: 0;
  currentUser: any = {};
  currentUserRole: any = {};
  websiteConstants: any = {};
  loaderSpinnerMessage: String;
  dtOptions: DataTables.Settings = {};
  public isData: Object = false;

  constructor(
    private http: HttpClient,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private _location: Location,
    private routeService: RouteService,
    private router: Router,
  ) {
    if (routeService.isRoutePermission !== true) {
      this.router.navigate(['error/unauthorized'])
    }
  }

  ngOnInit() {
    this.websiteConstants = WebsiteConstants;
    this.dtOptions = this.websiteConstants.tableOptions;
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    //this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.getCompanies();
  }

  getCompanies() {
    this.SpinnerService.show();
    let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.companies}`;
    this.http.get(apiUrl).subscribe((res: any) => {
      this.SpinnerService.hide();
      if (res.success == true && res.statusCode == 200) {
        this.companies = res.data.companies;
        if (this.companies)
          this.updateImagePath(this.companies);
        this.companiesTotal = this.companies.length;
        this.isData = true;
      } else if (res.success == false) {
        this.toastr.error(res.message, 'Error', { timeOut: 4000 })
      } else {
        this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
      }
      catchError(this.handleError)
    });
  }

  updateImagePath(data: []) {
    data.forEach(function (value: any) {
      if (value.logo) {
        value.logo = ApiConstants.webURL + '/' + value.logo;
      }
    });
  }

  delete(id: String, index: number) {
    if (window.confirm(MessageConstants.companyDeleteMessage)) {
      this.SpinnerService.show();
      this.http.delete(`${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.companyDelete}/${id}`)
        .subscribe((res: any) => {
          this.SpinnerService.hide();
          if (res.success == true && res.statusCode == 200) {
            this.removeArrayData(index);
            this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          } else if (res.success == false) {
            this.toastr.error(res.message, 'Error', { timeOut: 4000 })
          } else {
            this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
            catchError(this.handleError)
          }
        })
    }
  }

  removeArrayData(index: number) {
    if (index !== -1) {
      this.companies.splice(index, 1);
    }
  }

  backClicked() {
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
