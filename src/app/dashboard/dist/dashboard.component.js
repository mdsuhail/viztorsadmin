"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DashboardComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var message_1 = require("../_common/constants/message");
var website_1 = require("../_common/constants/website");
//import { LocalStorageService } from './../_services/localstorage/localstorage.service';
var Chart = require("chart.js");
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(dashboardService, branchService, SpinnerService, toastr, _location, formBuilder) {
        this.dashboardService = dashboardService;
        this.branchService = branchService;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this._location = _location;
        this.formBuilder = formBuilder;
        this.signinDateRangeForm = null;
        this.signoutDateRangeForm = null;
        this.showLatestSigninDetail = true;
        this.showLatestSignoutDetail = true;
        this.submitted = false;
        this.showDashboard = false;
        this.showViewAll = true;
        this.branches = [];
        this.websiteConstants = {};
        this.counterData = {};
        this.latestSignInVisitorsData = {};
        this.latestSignOutVisitorsData = {};
        this.currentUserRole = {};
        this.currentUserCompany = {};
        this.isData = false;
        this.params = {};
        // dataLatestSigninDetail: any;
        // dataLatestSignoutDetail: any;
        this.latestSigninDetail = {
            showLatest: true,
            showViewAll: true,
            branch: '',
            prefix: '',
            type: 'signin'
        };
        this.latestSignoutDetail = {
            showLatest: true,
            showViewAll: true,
            branch: '',
            prefix: '',
            type: 'signout'
        };
    }
    DashboardComponent.prototype.ngOnInit = function () {
        this.websiteConstants = website_1.WebsiteConstants;
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.signinDateRangeForm = this.formBuilder.group({
            start: ['', forms_1.Validators.required],
            end: ['', forms_1.Validators.required]
        });
        this.signoutDateRangeForm = this.formBuilder.group({
            start: ['', forms_1.Validators.required],
            end: ['', forms_1.Validators.required]
        });
        if (this.currentUserRole.name === 'companyadmin') {
            this.showViewAll = false;
            this.getBranches();
        }
        else {
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
    };
    DashboardComponent.prototype.getBranches = function () {
        var _this = this;
        this.SpinnerService.show();
        this.branchService.getBranchesByCompanyId(this.currentUserCompany._id)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.isData = true;
                _this.branches = res.data.branches;
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.SpinnerService.hide();
        });
    };
    DashboardComponent.prototype.getBranchDashboard = function (branch, event) {
        var idAttr = event.srcElement.attributes.id;
        var value = idAttr.nodeValue;
        $("button").removeClass("active-button");
        $("#" + value).addClass("active-button");
        this.showLatestSigninDetail = false;
        this.showLatestSignoutDetail = false;
        this.params = {
            branch: branch._id,
            prefix: branch.prefix
        };
        this.latestSigninDetail = {
            showLatest: this.latestSigninDetail.showLatest,
            showViewAll: false,
            branch: branch._id,
            prefix: branch.prefix,
            type: this.latestSigninDetail.type
        };
        this.latestSignoutDetail = {
            showLatest: this.latestSignoutDetail.showLatest,
            showViewAll: false,
            branch: branch._id,
            prefix: branch.prefix,
            type: this.latestSignoutDetail.showLatest
        };
        this.getData(this.params);
        this.getSigninChartData('', '', this.params);
        this.getSignoutChartData('', '', this.params);
        this.showDashboard = true;
    };
    Object.defineProperty(DashboardComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.signinDateRangeForm.controls; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DashboardComponent.prototype, "g", {
        // convenience getter for easy access to form fields
        get: function () { return this.signoutDateRangeForm.controls; },
        enumerable: false,
        configurable: true
    });
    DashboardComponent.prototype.onSubmitSigninDateRange = function () {
        this.submitted = true;
        // stop here if form is invalid
        if (this.signinDateRangeForm.invalid) {
            return;
        }
        this.getSigninChartData(this.signinDateRangeForm.value.start, this.signinDateRangeForm.value.end, this.params);
    };
    DashboardComponent.prototype.onSubmitSignoutDateRange = function () {
        this.submitted = true;
        // stop here if form is invalid
        if (this.signoutDateRangeForm.invalid) {
            return;
        }
        this.getSignoutChartData(this.signoutDateRangeForm.value.start, this.signoutDateRangeForm.value.end, this.params);
    };
    DashboardComponent.prototype.onResetSigninDateRangeForm = function () {
        this.submitted = false;
        this.signinDateRangeForm.reset();
        this.getSigninChartData();
    };
    DashboardComponent.prototype.onResetSignoutDateRangeForm = function () {
        this.submitted = false;
        this.signoutDateRangeForm.reset();
        this.getSignoutChartData();
    };
    DashboardComponent.prototype.getData = function (params) {
        var _this = this;
        this.SpinnerService.show();
        this.dashboardService.getData(params)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.isData = true;
                _this.counterData = res.data.counterData;
                _this.latestSignOutVisitorsData = res.data.latestSignOutVisitorsData;
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.SpinnerService.hide();
        });
    };
    DashboardComponent.prototype.getSigninChartData = function (startDate, endDate, params) {
        var _this = this;
        this.SpinnerService.show();
        this.dashboardService.signinChartData(startDate, endDate, params)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.isData = true;
                _this.signinChartData(res.data.signInVisitors);
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.SpinnerService.hide();
        });
    };
    DashboardComponent.prototype.getSignoutChartData = function (startDate, endDate, params) {
        var _this = this;
        this.SpinnerService.show();
        this.dashboardService.signoutChartData(startDate, endDate, params)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.isData = true;
                _this.signoutChartData(res.data.signOutVisitors);
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.SpinnerService.hide();
        });
    };
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
    DashboardComponent.prototype.signinChartData = function (data) {
        /* ----------==========     Signin Chart initialization For Documentation    ==========---------- */
        this.canvas = document.getElementById('signinChart');
        this.ctx = this.canvas.getContext('2d');
        var myChart = new Chart(this.ctx, {
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
                onClick: function (c, i) {
                    var e = i[0];
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
    };
    DashboardComponent.prototype.signoutChartData = function (data) {
        /* ----------==========     Signout Chart initialization    ==========---------- */
        this.canvas = document.getElementById('signoutChart');
        this.ctx = this.canvas.getContext('2d');
        var myChart = new Chart(this.ctx, {
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
                }
            }
        });
    };
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'app-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.css']
        })
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
