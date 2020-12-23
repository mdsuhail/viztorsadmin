import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as Chartist from 'chartist';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageConstants } from '../_common/constants/message';
import { WebsiteConstants } from '../_common/constants/website';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from './../_services/dashboard/dashboard.service';
import { BranchService } from './../_services/branch/branch.service';
//import { LocalStorageService } from './../_services/localstorage/localstorage.service';
import * as Chart from 'chart.js';
//import * as $ from 'jquery';
declare var $: any;
declare var require: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  canvas: any;
  ctx: any;
  signinDateRangeForm: FormGroup = null;
  signoutDateRangeForm: FormGroup = null;
  showLatestSigninDetail = true;
  showLatestSignoutDetail = true;
  showLatestPreApprovedVisitorToday = true;
  submitted = false;
  showDashboard = false;
  showViewAll = true;
  branches: any = [];
  websiteConstants: any = {};
  counterData: any = {};
  latestSignInVisitorsData: any = {};
  latestSignOutVisitorsData: any = {};
  currentUserRole: any = {};
  currentUserCompany: any = {};
  loaderSpinnerMessage: String;
  public isData: Object = false;
  params: any = {};
  // dataLatestSigninDetail: any;
  // dataLatestSignoutDetail: any;
  latestSigninDetail: any = {
    showLatest: true,
    showViewAll: true,
    branch: '',
    prefix: '',
    type: 'signin'
  }
  latestSignoutDetail: any = {
    showLatest: true,
    showViewAll: true,
    branch: '',
    prefix: '',
    type: 'signout'
  }
  latestPreApprovedVisitorToday: any = {
    showLatest: true,
    showViewAll: true,
    branch: '',
    prefix: '',
    type: 'preapprovedtoday'
  }
  constructor(
    private dashboardService: DashboardService,
    private branchService: BranchService,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private _location: Location,
    private formBuilder: FormBuilder,
    // public localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.websiteConstants = WebsiteConstants;
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.signinDateRangeForm = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
    this.signoutDateRangeForm = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
    });
    if (this.currentUserRole.name === 'companyadmin') {
      this.showViewAll = false;
      this.getBranches();
    } else {
      this.getData();
      this.getSigninChartData();
      this.getSignoutChartData();
      this.showDashboard = true;
    }

    //localstorage change event
    // this.localStorageService.store('test', 'testStore');
    // this.localStorageService.changes.subscribe(data => {
    //   console.log(data)
    // })
    // this.localStorageService.store('test', 'testStore1');

    // console.log('start');
    // $("#myCarousel").on("slide.bs.carousel", function (e: any) {
    //   var $e = $(e.relatedTarget);
    //   var idx = $e.index();
    //   var itemsPerSlide = 4;
    //   var totalItems = $(".carousel-item").length;

    //   console.log(totalItems);
    //   console.log(idx);

    //   if (idx >= totalItems - (itemsPerSlide - 1)) {
    //     var it = itemsPerSlide - (totalItems - idx);
    //     for (var i = 0; i < it; i++) {
    //       // append slides to end
    //       if (e.direction == "left") {
    //         $(".carousel-item")
    //           .eq(i)
    //           .appendTo(".carousel-inner");
    //       } else {
    //         $(".carousel-item")
    //           .eq(0)
    //           .appendTo($(this).find(".carousel-inner"));
    //       }
    //     }
    //   }
    // });
  }

  getBranches() {
    this.SpinnerService.show();
    this.branchService.getBranchesByCompanyId(this.currentUserCompany._id)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.isData = true;
          this.branches = res.data.branches;
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

  getBranchDashboard(branch, event) {
    var idAttr = event.srcElement.attributes.id;
    var value = idAttr.nodeValue;
    $("button").removeClass("active-button");
    $("#" + value).addClass("active-button");
    this.showLatestSigninDetail = false;
    this.showLatestSignoutDetail = false;
    this.showLatestPreApprovedVisitorToday = false;
    this.params = {
      branch: branch._id,
      prefix: branch.prefix
    }
    this.latestSigninDetail = {
      showLatest: this.latestSigninDetail.showLatest,
      showViewAll: false,
      branch: branch._id,
      prefix: branch.prefix,
      type: this.latestSigninDetail.type
    }
    this.latestSignoutDetail = {
      showLatest: this.latestSignoutDetail.showLatest,
      showViewAll: false,
      branch: branch._id,
      prefix: branch.prefix,
      type: this.latestSignoutDetail.showLatest,
    }
    this.getData(this.params);
    this.getSigninChartData('', '', this.params);
    this.getSignoutChartData('', '', this.params);
    this.showDashboard = true;
  }

  // convenience getter for easy access to form fields
  get f() { return this.signinDateRangeForm.controls; }

  // convenience getter for easy access to form fields
  get g() { return this.signoutDateRangeForm.controls; }

  onSubmitSigninDateRange() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signinDateRangeForm.invalid) {
      return;
    }
    this.getSigninChartData(this.signinDateRangeForm.value.start, this.signinDateRangeForm.value.end, this.params);
  }

  onSubmitSignoutDateRange() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signoutDateRangeForm.invalid) {
      return;
    }
    this.getSignoutChartData(this.signoutDateRangeForm.value.start, this.signoutDateRangeForm.value.end, this.params);
  }

  onResetSigninDateRangeForm() {
    this.submitted = false;
    this.signinDateRangeForm.reset();
    this.getSigninChartData();
  }

  onResetSignoutDateRangeForm() {
    this.submitted = false;
    this.signoutDateRangeForm.reset();
    this.getSignoutChartData();
  }

  getData(params?) {
    this.SpinnerService.show();
    this.dashboardService.getData(params)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.isData = true;
          this.counterData = res.data.counterData;
          this.latestSignOutVisitorsData = res.data.latestSignOutVisitorsData;
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

  getSigninChartData(startDate?: string, endDate?: string, params?: any) {
    this.SpinnerService.show();
    this.dashboardService.signinChartData(startDate, endDate, params)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.isData = true;
          this.signinChartData(res.data.signInVisitors);
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

  getSignoutChartData(startDate?: string, endDate?: string, params?: any) {
    this.SpinnerService.show();
    this.dashboardService.signoutChartData(startDate, endDate, params)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.isData = true;
          this.signoutChartData(res.data.signOutVisitors);
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

  // startAnimationForLineChart(chart) {
  //   let seq: any, delays: any, durations: any;
  //   seq = 0;
  //   delays = 80;
  //   durations = 500;

  //   chart.on('draw', function (data) {
  //     if (data.type === 'line' || data.type === 'area') {
  //       data.element.animate({
  //         d: {
  //           begin: 600,
  //           dur: 700,
  //           from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
  //           to: data.path.clone().stringify(),
  //           easing: Chartist.Svg.Easing.easeOutQuint
  //         }
  //       });
  //     } else if (data.type === 'point') {
  //       seq++;
  //       data.element.animate({
  //         opacity: {
  //           begin: seq * delays,
  //           dur: durations,
  //           from: 0,
  //           to: 1,
  //           easing: 'ease'
  //         }
  //       });
  //     }
  //   });
  //   seq = 0;
  // };
  // startAnimationForBarChart(chart) {
  //   let seq2: any, delays2: any, durations2: any;
  //   seq2 = 0;
  //   delays2 = 80;
  //   durations2 = 500;
  //   chart.on('draw', function (data) {
  //     if (data.type === 'bar') {
  //       seq2++;
  //       data.element.animate({
  //         opacity: {
  //           begin: seq2 * delays2,
  //           dur: durations2,
  //           from: 0,
  //           to: 1,
  //           easing: 'ease'
  //         }
  //       });
  //     }
  //   });
  //   seq2 = 0;
  // };

  signinChartData(data: any) {
    /* ----------==========     Signin Chart initialization For Documentation    ==========---------- */
    this.canvas = document.getElementById('signinChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: data.graphLabels,
        datasets: [{
          label: '# Check-in Visitors',
          data: data.graphData,
          backgroundColor: data.graphBackground,
          borderWidth: 5
        }]
      },
      options: {
        responsive: true,
        display: true,
        scales: {
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: true,
                color: "rgba(255,99,132,0.2)"
              },
              ticks: {
                // suggestedMax: 100,
                suggestedMin: 0
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        onClick: (c: any, i: any) => {
          let e = i[0];
          //console.log(e._index)
          //var x_value = data.labels[e._index];
          //var y_value = data.datasets[0].data[e._index];
          //console.log(x_value);
          //console.log(y_value);
        }
      }
    });


    // const dataSigninChart: any = {
    //   labels: data.graphLabels,
    //   series: [
    //     data.graphData
    //   ]
    // };

    // const optionsSigninChart: any = {
    //   lineSmooth: Chartist.Interpolation.cardinal({
    //     tension: 0
    //   }),
    //   low: data.low,
    //   high: data.high, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
    //   chartPadding: { top: 15, right: 0, bottom: 0, left: 0 },
    // }
    // var signinChart = new Chartist.Line('#signinChart', dataSigninChart, optionsSigninChart);
    // this.startAnimationForLineChart(signinChart);
  }

  signoutChartData(data: any) {
    /* ----------==========     Signout Chart initialization    ==========---------- */
    this.canvas = document.getElementById('signoutChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: data.graphLabels,
        datasets: [{
          label: '# Check-out Visitors',
          data: data.graphData,
          backgroundColor: data.graphBackground,
          borderWidth: 5
        }]
      },
      options: {
        responsive: true,
        display: true,
        scales: {
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: true,
                color: "rgba(255,99,132,0.2)"
              },
              ticks: {
                // suggestedMax: 100,
                suggestedMin: 0
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
      }
    });

  }


  //   const dataSignoutChart: any = {
  //     labels: data.graphLabels,
  //     series: [
  //       data.graphData
  //     ]
  //   };

  //   const optionsSignoutChart: any = {
  //     lineSmooth: Chartist.Interpolation.cardinal({
  //       tension: 0
  //     }),
  //     low: data.low,
  //     high: data.high, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
  //     chartPadding: { top: 15, right: 0, bottom: 0, left: 0 }
  //   }

  //   var signoutChart = new Chartist.Line('#signoutChart', dataSignoutChart, optionsSignoutChart);
  //   // start animation for the Completed Tasks Chart - Line Chart
  //   this.startAnimationForLineChart(signoutChart);
  // }
}
