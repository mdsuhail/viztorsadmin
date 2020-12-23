import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { ApiConstants } from '../../../_common/constants/api';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { VisitorService } from './../../../_services/visitor/visitor.service';
import { ExportService } from './../../../_services/export/export.service';

@Component({
  selector: 'app-visitor-list-dashboard',
  templateUrl: './visitor-list-dashboard.component.html',
  styleUrls: ['./visitor-list-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitorListDashboardComponent implements OnInit, OnChanges {

  @Input() latestSigninDetail: any = {
    showLatest: false,
    showViewAll: true,
    branch: '',
    prefix: '',
    type: 'signin'
  };
  @Input() latestSignoutDetail: any = {
    showLatest: false,
    showViewAll: true,
    branch: '',
    prefix: '',
    type: 'signout'
  };
  @Input() latestPreApprovedVisitorToday: any = {
    showLatest: false,
    showViewAll: true,
    branch: '',
    prefix: '',
    type: 'preapprovedtoday'
  };
  visitors: [];
  visitorsTotal: 0;
  currentUser: any = {};
  currentUserRole: any = {};
  websiteConstants: any = {};
  loaderSpinnerMessage: String;
  dtOptions: DataTables.Settings = {};
  public isData: Object = false;
  showVisitorDetailModal: boolean = false;
  visitorDetail: any;

  constructor(
    private visitorService: VisitorService,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private routeService: RouteService,
    private router: Router,
    private exportService: ExportService
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
    this.getVisitorsList();
  }

  ngOnChanges() {
    if (this.latestSigninDetail.branch && this.latestSigninDetail.prefix)
      this.getVisitorsList();
    if (this.latestSignoutDetail.branch && this.latestSignoutDetail.prefix)
      this.getVisitorsList();
  }

  getVisitorsList() {
    if (this.latestSigninDetail.showLatest) {
      var params = {
        'type': 'signin',
        'page': 1,
        'limit': 12,
        'branch': this.latestSigninDetail.branch ? this.latestSigninDetail.branch : '',
        'prefix': this.latestSigninDetail.prefix ? this.latestSigninDetail.prefix : ''
      }
      this.getVisitors(params);
    } else if (this.latestSignoutDetail.showLatest) {
      var params = {
        'type': 'signout',
        'page': 1,
        'limit': 12,
        'branch': this.latestSignoutDetail.branch ? this.latestSignoutDetail.branch : '',
        'prefix': this.latestSignoutDetail.prefix ? this.latestSignoutDetail.prefix : ''
      }
      this.getVisitors(params);
    } else if (this.latestPreApprovedVisitorToday.showLatest) {
      var params = {
        'type': 'preapprovedtoday',
        'page': 1,
        'limit': 12,
        'branch': this.latestPreApprovedVisitorToday.branch ? this.latestPreApprovedVisitorToday.branch : '',
        'prefix': this.latestPreApprovedVisitorToday.prefix ? this.latestPreApprovedVisitorToday.prefix : ''
      }
      this.getVisitors(params);
    } else
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
    var params = '';
    if (this.currentUserRole && this.currentUserRole.name === 'companyadmin') {
      if (this.latestSigninDetail.branch && this.latestSigninDetail.prefix)
        params = '?branch=' + this.latestSigninDetail.branch + '&prefix=' + this.latestSigninDetail.prefix;
      else if (this.latestSignoutDetail.branch && this.latestSignoutDetail.prefix)
        params = '?branch=' + this.latestSignoutDetail.branch + '&prefix=' + this.latestSignoutDetail.prefix;
    }
    if (visitorId && visitorId != undefined) {
      var url = "/visitor/pass/" + visitorId + params;
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
    });
  }

  signOut(id: String, visitor: any, index: number) {
    if (window.confirm(MessageConstants.visitorSignOutMessage)) {
      this.SpinnerService.show();
      visitor.signOut = new Date();
      this.visitorService.signOutVisitor(id, visitor)
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
