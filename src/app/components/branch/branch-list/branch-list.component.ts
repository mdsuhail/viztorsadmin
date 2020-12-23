import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { BranchService } from './../../../_services/branch/branch.service';
import { RouteService } from './../../../_services/route/route.service';
@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {

  branches: [];
  branchesTotal: 0;
  currentUser: any = {};
  currentUserRole: any = {};
  websiteConstants: any = {};
  loaderSpinnerMessage: String;
  dtOptions: DataTables.Settings = {};
  public isData: Object = false;

  constructor(
    private branchService: BranchService,
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
    this.getBranches();
  }

  getBranches() {
    this.SpinnerService.show();
    this.branchService.getBranches()
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.branches = res.data.branches;
          this.branchesTotal = this.branches.length;
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
    if (window.confirm(MessageConstants.branchDeleteMessage)) {
      this.SpinnerService.show();
      this.branchService.deleteBranch(id)
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
      this.branches.splice(index, 1);
    }
  }

  backClicked() {
    this.branchService.back();
  }

}
