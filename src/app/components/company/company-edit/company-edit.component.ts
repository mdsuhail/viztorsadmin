import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, take, tap, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiConstants } from '../../../_common/constants/api';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
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
    private routeService: RouteService,
  ) {
    if (routeService.isRoutePermission !== true) {
      this.router.navigate(['error/unauthorized'])
    }
  }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.websiteConstants = WebsiteConstants;
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getProfile(id);
    });
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailDomain: ['', [Validators.required]],
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

  setDetail(data: any) {
    this.form.setValue({
      name: data.name,
      email: data.email,
      emailDomain: data.emailDomain,
      contact: data.contact,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      logo: data.logo,
      website: data.website,
      image: data.image ? data.image : '',
      active: data.active,
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
          this.router.navigate(['/company/list']);
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
