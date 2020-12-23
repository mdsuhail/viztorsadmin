import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, take, tap, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from '../../../auth/auth.service'
import { ApiConstants } from '../../../_common/constants/api';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
  currentUserCompany: any = {};
  data: any = {};
  logoUrl;

  constructor(
    private http: HttpClient,
    public router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private _location: Location,
    private authService: AuthenticateService
  ) { }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
    this.websiteConstants = WebsiteConstants;
    if (this.currentUserCompany._id) {
      const id = this.currentUserCompany._id;
      this.getProfile(id);
    }
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      logo: [''],
      website: [''],
      image: [''],
      active: [true, [Validators.required]],
    });
  }

  // Company profile
  getProfile(id) {
    let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.companyProfile}/${id}`;
    this.http.get(apiUrl).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200) {
        this.data = res.data.company;
        this.setDetail(this.data);
      }
      catchError(this.handleError)
    });
  }

  setDetail(data) {
    this.form.setValue({
      name: data.name,
      email: data.email,
      contact: data.contact,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      logo: data.logo,
      website: data.website,
      image: data.image ? data.image : '',
      active: data.active
    });
    this.logoUrl = data.logo ? ApiConstants.webURL + '/' + data.logo : ''
  }

  onFileChange($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    if (file && file !== undefined) {
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        var image = myReader.result;
        this.form.patchValue({
          image: image
        });
      }
      myReader.readAsDataURL(file);
    }
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
    let id = this.data._id;
    this.http.put(`${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.companyProfile}/${id}`, this.form.value)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.authService.setLocalData('company', res.data.company);
          window.location.reload(true);
          //this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
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
