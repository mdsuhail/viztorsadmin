import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentService } from './../../../_services/department/department.service';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss']
})
export class DepartmentEditComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
  currentUserRole: any = {};
  currentUserCompany: any = {};
  data: any = {};

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private departmentService: DepartmentService,
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
      this.getDepartment(id);
    });
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      default: [false],
      active: [true, [Validators.required]],
    });
  }

  // Deapartment profile
  getDepartment(id: any) {
    this.departmentService.getDepartment(id)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.data = res.data.department;
          this.setDetail(this.data);
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  setDetail(data) {
    this.form.setValue({
      name: data.name,
      description: data.description,
      active: data.active,
      default: data.default
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
    this.departmentService.updateDepartment(id, this.form.value)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.router.navigate(['/department/list']);
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
    this.departmentService.back();
  }

}
