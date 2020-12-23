import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, take, tap, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConstants } from '../../../_common/constants/api';
import { MessageConstants } from '../../../_common/constants/message';
import { RouteService } from './../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../../../_helpers/password-match.validators';
import { BranchService } from './../../../_services/branch/branch.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  showBranch = false;
  roles: [];
  companies: [];
  branches: [];
  userData: any = {};
  currentUserRole: any = {};
  currentUserCompany: any = {};
  currentUserBranch: any = {};
  selectedRole: any = {};
  loaderSpinnerMessage: String;

  constructor(
    private http: HttpClient,
    public route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private _location: Location,
    private routeService: RouteService,
    private branchService: BranchService
  ) {
    if (routeService.isRoutePermission !== true) {
      this.router.navigate(['error/unauthorized'])
    }
  }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.getRoles();
    if (this.currentUserRole.name == 'superadmin')
      this.getCompanies();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getUserProfile(id);
    });
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
      //this.form.controls.company.setValue(this.currentUserCompany._id);
    }
    if (this.currentUserRole.name === 'companyadmin') {
      //this.getBranchesByCompanyId(this.currentUserCompany._id);
    }
    if (this.currentUserRole.name === 'branchadmin') {
      this.currentUserBranch = JSON.parse(localStorage.getItem('branch'));
    }
  }

  getCompanies() {
    let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.companies}`;
    this.http.get(apiUrl).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200) {
        this.companies = res.data.companies;
      }
      catchError(this.handleError)
    });
  }

  getRoles() {
    let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.roles}`;
    this.http.get(apiUrl).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200) {
        this.roles = res.data.roles;
      }
      catchError(this.handleError)
    });
  }

  getBranchesByCompanyId(id: any) {
    if (id) {
      this.SpinnerService.show();
      this.branchService.getBranchesByCompanyId(id)
        .subscribe((res: any) => {
          this.SpinnerService.hide();
          if (res.success == true && res.statusCode == 200) {
            this.branches = res.data.branches;
          }
        }, err => {
          console.log(err);
          this.SpinnerService.hide();
        });
    }
  }

  onSelectRole(selectedRole: any) {
    const branchControl = this.form.get('branch');
    this.selectedRole = selectedRole;
    selectedRole = this.getRoleById(selectedRole);
    if (selectedRole && (selectedRole.name === 'branchadmin' || selectedRole.name === 'user') && (this.currentUserRole.name === 'superadmin' || this.currentUserRole.name === 'companyadmin')) {
      this.showBranch = true;
      branchControl.setValidators([Validators.required]);
    } else {
      this.showBranch = false;
      branchControl.setValidators(null);
      this.form.controls.branch.setValue('');
    }
  }

  getRoleById(id) {
    return this.roles.find(function (role: any) {
      return role._id == id;
    });
  }

  // User profile
  getUserProfile(id) {
    let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.userProfile}/${id}`;
    this.http.get(apiUrl).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200) {
        this.userData = res.data;
        this.setDetail(this.userData);
        if (this.userData.company && this.userData.company._id)
          this.getBranchesByCompanyId(this.userData.company._id);
      }
      catchError(this.handleError)
    });
  }

  setDetail(userData) {
    this.form.setValue({
      company: userData.company ? userData.company._id : '',
      branch: userData.branch && userData.branch !== null && Object.keys(userData.branch).length > 0 ? userData.branch._id : '',
      role: userData.role ? userData.role._id : '',
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
    //this.updateRoleId();
    if (!this.form.value.branch && this.currentUserRole.name === 'branchadmin')
      this.updateBranchId();

    // submit form on success
    this.SpinnerService.show();
    let id = this.userData.user._id;
    this.http.put(`${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.userProfile}/${id}`, this.form.value)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.router.navigate(['/user/list']);
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
          catchError(this.handleError)
        }
      })
  }

  updateRoleId() {
    this.form.value.role = this.form.value.role._id;
  }

  updateBranchId() {
    this.form.value.branch = this.currentUserBranch._id;
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
