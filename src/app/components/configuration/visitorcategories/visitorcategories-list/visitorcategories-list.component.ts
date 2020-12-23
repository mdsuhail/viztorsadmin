import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageConstants } from '../../../../_common/constants/message';
import { WebsiteConstants } from '../../../../_common/constants/website';
import { ApiConstants } from '../../../../_common/constants/api';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { CommonService } from './../../../../_services/global/common.service';
import { VisitorcategoriesService } from './../../../../_services/visitorcategories/visitorcategories.service';
import { RouteService } from './../../../../_services/route/route.service';

@Component({
  selector: 'app-visitorcategories-list',
  templateUrl: './visitorcategories-list.component.html',
  styleUrls: ['./visitorcategories-list.component.scss']
})
export class VisitorcategoriesListComponent implements OnInit {

  visitorCategories: [];
  currentUser: any = {};
  currentUserRole: any = {};
  websiteConstants: any = {};
  loaderSpinnerMessage: String;
  dtOptions: DataTables.Settings = {};
  public isData: Object = false;

  constructor(
    private visitorcategoriesService: VisitorcategoriesService,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private routeService: RouteService,
    private router: Router,
    public commonService: CommonService
  ) {
  }

  ngOnInit() {
    this.websiteConstants = WebsiteConstants;
    this.dtOptions = this.websiteConstants.tableOptions;
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    //this.currentUser = JSON.parse(localStorage.getItem('user'));
    //this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.getVisitorCategories();
  }

  getVisitorCategories() {
    this.SpinnerService.show();
    this.visitorcategoriesService.getVisitorCategories()
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.visitorCategories = res.data.visitorCategories;
          if (this.visitorCategories)
            this.updateImagePath(this.visitorCategories);
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
      if (value.backgroundImagePath) {
        value.backgroundImagePath = ApiConstants.webURL + '/' + value.backgroundImagePath;
      }
    });
  }

  delete(id: String, index: number) {
    if (window.confirm(MessageConstants.visitorCategoryDeleteMessage)) {
      this.SpinnerService.show();
      this.visitorcategoriesService.deleteVisitorCategory(id)
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
      this.visitorCategories.splice(index, 1);
    }
  }

  backClicked() {
    this.commonService.back();
  }

}
