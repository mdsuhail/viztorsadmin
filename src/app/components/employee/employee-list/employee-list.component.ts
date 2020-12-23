import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from './../../../_services/employee/employee.service';
import { ExportService } from './../../../_services/export/export.service';
import { RouteService } from './../../../_services/route/route.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

  employees: []
  employeesTotal: 0
  currentUser: any = {};
  currentUserRole: any = {};
  websiteConstants: any = {};
  loaderSpinnerMessage: String;
  dtOptions: DataTables.Settings = {};
  public isData: Object = false;

  jsonData: any;
  worksheet: any;
  fileUploaded: File;
  storeData: any;

  constructor(
    public router: Router,
    private http: HttpClient,
    private employeeService: EmployeeService,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private _location: Location,
    private exportService: ExportService,
    private routeService: RouteService,
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
    this.getEmployees();
  }

  downloadSampleFile() {
    const fileUrl = './assets/sample-file/EmployeesUploadSample.xlsx';
    const fileName = 'EmployeesUploadSample.xlsx';
    FileSaver.saveAs(fileUrl, fileName);
  }

  getEmployees() {
    this.SpinnerService.show();
    this.employeeService.getEmployees()
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.employees = res.data.employees;
          this.employeesTotal = this.employees.length;
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

  async uploadedFile(event) {
    if (window.confirm(MessageConstants.employeeImportMessage)) {
      this.fileUploaded = event.target.files[0];
      this.convertToJson();
    }
  }

  convertToJson() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
      this.readAsJson();
    }
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
    this.importEmployees();
  }

  importEmployees() {
    this.SpinnerService.show();
    this.employeeService.addEmployees(this.jsonData)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.getEmployees();
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

  exportList(tableId: string, fileName: string): void {
    this.exportService.export(tableId, fileName);
  }

  delete(id: String, index: number) {
    if (window.confirm(MessageConstants.employeeDeleteMessage)) {
      this.SpinnerService.show();
      this.employeeService.deleteEmployee(id)
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
      this.employees.splice(index, 1);
    }
  }

  backClicked() {
    this.employeeService.back();
  }

  getFullName(firstName, lastName) {
    return firstName + ' ' + lastName;
  }

}
