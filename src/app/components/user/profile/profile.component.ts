import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, take, tap, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from '../../../_common/constants/api';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../../../_helpers/password-match.validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  roles: [];
  companies: [];
  userData: any = {};
  currentUser: any = {};
  currentUserRole: any = {};
  websiteConstants: any = {};
  currentUserCompany: any = {};
  loaderSpinnerMessage: String;
  fieldTextType: boolean;

  constructor(
    private http: HttpClient,
    public route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.websiteConstants = WebsiteConstants;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    if (this.currentUser._id) {
      const id = this.currentUser._id;
      this.getUserProfile(id);
    };
    //this.getCompanies();
    this.getRoles();
    this.form = this.formBuilder.group({
      company: ['', Validators.required],
      branch: [''],
      role: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      active: [true, [Validators.required]],
      password: [''],
      confirmPassword: [''],
      //acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    if (this.currentUserRole.name != 'superadmin') {
      this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
      this.form.controls.company.setValue(this.currentUserCompany._id);
    }

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  // getCompanies() {
  //   let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.companies}`;
  //   this.http.get(apiUrl).subscribe((res: any) => {
  //     if (res.success == true && res.statusCode == 200) {
  //       this.companies = res.data.companies;
  //     }
  //     catchError(this.handleError)
  //   });
  // }

  getRoles() {
    let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.roles}` + '?type=all';
    this.http.get(apiUrl).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200) {
        this.roles = res.data.roles;
      }
      catchError(this.handleError)
    });
  }

  // User profile
  getUserProfile(id) {
    let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.userProfile}/${id}`;
    this.http.get(apiUrl).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200) {
        this.userData = res.data;
        this.setDetail(this.userData);
      }
      catchError(this.handleError)
    });
  }

  setDetail(userData) {
    this.form.setValue({
      company: userData.company._id,
      branch: userData.branch && userData.branch !== null && Object.keys(userData.branch).length > 0 ? userData.branch._id : '',
      role: userData.role._id,
      firstname: userData.user.firstname,
      lastname: userData.user.lastname,
      email: userData.user.email,
      active: userData.user.active,
      password: '',
      confirmPassword: ''
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // submit form on success
    this.SpinnerService.show();
    let id = this.userData.user._id;
    this.http.put(`${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.userProfile}/${id}`, this.form.value)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          //this.router.navigate(['/']);
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
          catchError(this.handleError)
        }
      })
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
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
