import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from './../../../_services/employee/employee.service';
import { DepartmentService } from './../../../_services/department/department.service';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss']
})
export class EmployeeEditComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
  currentUserRole: any = {};
  currentUserCompany: any = {};
  data: any = {};
  departments: [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private routeService: RouteService,
    private departmentService: DepartmentService,
  ) {
    if (routeService.isRoutePermission !== true) {
      this.router.navigate(['error/unauthorized'])
    }
  }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.websiteConstants = WebsiteConstants;
    this.getDepartments();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getEmploee(id);
    });
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
    this.form = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      contact: ['', [Validators.required]],
      company: [(this.currentUserCompany ? this.currentUserCompany._id : '')],
      department: [''],
      active: [true, [Validators.required]],
      isVerified: [false],
      createdAt: ['']
    });
  }

  // Employee profile
  getEmploee(id: any) {
    this.employeeService.getEmployee(id)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.data = res.data.employee;
          this.setDetail(this.data);
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  setDetail(data) {
    this.form.setValue({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      contact: data.contact,
      company: data.company,
      department: data.department ? data.department._id : '',
      active: data.active ? data.active : false,
      isVerified: data.isVerified ? data.isVerified : false,
      createdAt: data.createdAt ? data.createdAt : new Date()
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
    this.SpinnerService.show();
    let id = this.data._id;
    this.employeeService.updateEmployee(id, this.form.value)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.router.navigate(['/employee/list']);
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  getDepartments() {
    this.SpinnerService.show();
    this.departmentService.getDepartments()
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.departments = res.data.departments;
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }

  backClicked() {
    this.employeeService.back();
  }

}
