import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { BranchService } from './../../../_services/branch/branch.service';
import { CompanyService } from './../../../_services/company/company.service';
import * as moment from 'moment';

@Component({
  selector: 'app-branch-add',
  templateUrl: './branch-add.component.html',
  styleUrls: ['./branch-add.component.scss']
})
export class BranchAddComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  showCustomPlan = false;
  companies: [];
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
  currentUserRole: any = {};
  currentUserCompany: any = {};
  minDate = moment(new Date()).add(1, 'd').format('YYYY-MM-DD');

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private branchService: BranchService,
    private companyService: CompanyService,
    private routeService: RouteService,
  ) {
    if (routeService.isRoutePermission !== true) {
      this.router.navigate(['error/unauthorized'])
    }
  }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.websiteConstants = WebsiteConstants;
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
    this.getCompanies();
    this.form = this.formBuilder.group({
      company: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      logo: [''],
      website: [''],
      prefix: [''],
      isVisitorApproval: [false],
      isTouchless: [false],
      isGovernmentIdUpload: [false],
      isItemImageUpload: [false],
      accountExpiryDate: ['', [Validators.required]],
      accountPlan: ['', [Validators.required]],
      customPlanValue: [''],
      active: [true, [Validators.required]],
    });
  }

  getCompanies() {
    this.SpinnerService.show();
    this.companyService.getCompanies()
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.companies = res.data.companies;
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  isCustomPlanVisible(value: any) {
    const customPlanValueControl = this.form.get('customPlanValue');
    if (value === 'custom') {
      customPlanValueControl.setValidators([Validators.required]);
      this.showCustomPlan = true
    } else {
      customPlanValueControl.setValidators(null);
      this.showCustomPlan = false
      this.form.controls.customPlanValue.setValue('');
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
    this.SpinnerService.show();
    this.branchService.addBranch(this.form.value)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.router.navigate(['/branch/list']);
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
    this.branchService.back();
  }

}
