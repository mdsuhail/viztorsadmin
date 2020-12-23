import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from './../../../_services/department/department.service';
import { RouteService } from './../../../_services/route/route.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  departments: [];
  departmentsTotal: 0;
  currentUser: any = {};
  currentUserRole: any = {};
  websiteConstants: any = {};
  loaderSpinnerMessage: String;
  dtOptions: DataTables.Settings = {};
  public isData: Object = false;

  constructor(
    private departmentService: DepartmentService,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
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
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.getDepartments();
  }

  getDepartments() {
    this.SpinnerService.show();
    this.departmentService.getDepartments()
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.departments = res.data.departments;
          this.departmentsTotal = this.departments.length;
          this.isData = true;
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

  delete(id: String, index: number) {
    if (window.confirm(MessageConstants.departmentDeleteMessage)) {
      this.SpinnerService.show();
      this.departmentService.deleteDepartment(id)
        .subscribe((res: any) => {
          this.SpinnerService.hide();
          if (res.success == true && res.statusCode == 200) {
            this.removeArrayData(index);
            this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          } else if (res.success == false) {
            this.toastr.error(res.message, 'Error', { timeOut: 4000 })
          } else {
            this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
          }
        })
    }
  }

  removeArrayData(index: number) {
    if (index !== -1) {
      this.departments.splice(index, 1);
    }
  }

  backClicked() {
    this.departmentService.back();
  }

}
