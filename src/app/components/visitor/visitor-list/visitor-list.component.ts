import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { ApiConstants } from '../../../_common/constants/api';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { VisitorService } from './../../../_services/visitor/visitor.service';
import { ExportService } from './../../../_services/export/export.service';
import { DepartmentService } from './../../../_services/department/department.service';
import { EmployeeService } from './../../../_services/employee/employee.service';

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.component.html',
  styleUrls: ['./visitor-list.component.scss']
})
export class VisitorListComponent implements OnInit {

  @Input() latestSigninDetail: any = {
    showLatest: false
  };
  form: FormGroup = null;
  visitors: [];
  visitorsTotal: 0;
  queryParams: any = {};
  currentUser: any = {};
  currentUserRole: any = {};
  currentBranch: any = {};
  websiteConstants: any = {};
  loaderSpinnerMessage: String;
  dtOptions: DataTables.Settings = {};
  public isData: Object = false;
  showVisitorDetailModal: boolean = false;
  visitorDetail: any;
  departments: [];
  employees: [];

  constructor(
    public platform: Platform,
    private visitorService: VisitorService,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private routeService: RouteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private exportService: ExportService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
  ) {
    if (routeService.isRoutePermission !== true) {
      this.router.navigate(['error/unauthorized'])
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      start: [''],
      end: [''],
      type: [''],
      department: [''],
      employee: ['']
    });
    this.websiteConstants = WebsiteConstants;
    this.dtOptions = this.websiteConstants.tableOptions;
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.currentBranch = JSON.parse(localStorage.getItem('branch'));
    this.getQueryParams();
    this.getDepartments();
    this.getEmployees();
    this.getVisitorsList();
    this.getVisitorsList();
  }

  getQueryParams() {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.queryParams.type = params.type;
      });
  }

  getVisitorsList() {
    var params = {};
    if (this.form.value.type || this.form.value.start || this.form.value.end || this.form.value.department || this.form.value.employee) {
      params = {
        'type': this.form.value.type,
        'start': this.form.value.start,
        'end': this.form.value.end,
        'department': this.form.value.department,
        'employee': this.form.value.employee,
        'page': 0,
        'limit': 0,
      }
      this.getVisitors(params);
    } else if (this.queryParams) {
      params = {
        'type': this.queryParams.type,
        'page': 0,
        'limit': 0,
      }
      this.getVisitors(params);
    }
    else
      this.getVisitors();
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

  // getEmployeeByDepartmentId(id) {
  //   // this.SpinnerService.show();
  //   this.employeeService.getEmployeesByDepartmentId(id)
  //     .subscribe((res: any) => {
  //       // this.SpinnerService.hide();
  //       if (res.success == true && res.statusCode == 200) {
  //         this.employees = res.data.employees;
  //       } else {
  //         this.employees = []
  //       }
  //     }, err => {
  //       console.log(err);
  //       this.SpinnerService.hide();
  //     });
  // }

  getEmployees() {
    this.SpinnerService.show();
    this.employeeService.getEmployees()
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.employees = res.data.employees;
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

  redirectCheckin() {
    window.open(ApiConstants.checkinURL, "_blank");
  }

  onResetForm() {
    this.form.reset();
    this.getVisitors();
  }

  exportList(tableId: string, fileName: string): void {
    this.exportService.export(tableId, fileName);
  }

  detail(visitor: any) {
    this.visitorDetail = visitor;
    this.showVisitorDetailModal = true; // Show-Hide Modal Check
  }

  closePop(event) {
    this.visitorDetail = {};
    this.showVisitorDetailModal = false; // Show-Hide Modal Check
  }

  print(visitorId) {
    if (visitorId && visitorId != undefined) {
      var url = "/visitor/pass/" + visitorId;
      window.open(url, '', 'height=550,width=600');
    }
  }

  getFullName(firstName, lastName) {
    return firstName + ' ' + lastName;
  }

  getVisitors(params?: any) {
    this.SpinnerService.show();
    this.visitorService.getVisitors(params)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.visitors = res.data.visitors;
          if (this.visitors)
            this.updateImagePath(this.visitors);
          this.visitorsTotal = this.visitors.length;
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

  updateImagePath(data: []) {
    data.forEach(function (value: any) {
      if (value.profileImagePath) {
        value.profileImagePath = ApiConstants.webURL + '/' + value.profileImagePath;
      }
      if (value.governmentIdUploadedImagePath && value.governmentIdUploadedImagePath !== null) {
        value.governmentIdUploadedImagePath = ApiConstants.webURL + '/' + value.governmentIdUploadedImagePath;
      }
      if (value.itemImageUploadedPath && value.itemImageUploadedPath !== null) {
        value.itemImageUploadedPath = ApiConstants.webURL + '/' + value.itemImageUploadedPath;
      }
    });
  }

  signOut(id: String, visitor: any) {
    if (window.confirm(MessageConstants.visitorSignOutMessage)) {
      this.SpinnerService.show();
      visitor.signOut = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      this.visitorService.signOutVisitor(id, visitor)
        .subscribe((res: any) => {
          this.SpinnerService.hide();
          if (res.success == true && res.statusCode == 200) {
            this.toastr.success(res.message, 'Success', { timeOut: 3000 })
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
  }

  delete(id: String, index: number) {
    if (window.confirm(MessageConstants.visitorDeleteMessage)) {
      this.SpinnerService.show();
      this.visitorService.deleteVisitor(id)
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
        }, err => {
          console.log(err);
          this.SpinnerService.hide();
        });
    }
  }

  removeArrayData(index: number) {
    if (index !== -1) {
      this.visitors.splice(index, 1);
    }
  }

  backClicked() {
    this.visitorService.back();
  }

}
