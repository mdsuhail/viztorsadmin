"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VisitorListComponent = void 0;
var core_1 = require("@angular/core");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var api_1 = require("../../../_common/constants/api");
var VisitorListComponent = /** @class */ (function () {
    function VisitorListComponent(platform, visitorService, SpinnerService, toastr, routeService, formBuilder, router, route, exportService) {
        this.platform = platform;
        this.visitorService = visitorService;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this.routeService = routeService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.route = route;
        this.exportService = exportService;
        this.latestSigninDetail = {
            showLatest: false
        };
        this.form = null;
        this.queryParams = {};
        this.currentUser = {};
        this.currentUserRole = {};
        this.currentBranch = {};
        this.websiteConstants = {};
        this.dtOptions = {};
        this.isData = false;
        this.showVisitorDetailModal = false;
        if (routeService.isRoutePermission !== true) {
            this.router.navigate(['error/unauthorized']);
        }
    }
    VisitorListComponent.prototype.ngOnInit = function () {
        this.form = this.formBuilder.group({
            start: [''],
            end: [''],
            type: ['']
        });
        this.websiteConstants = website_1.WebsiteConstants;
        this.dtOptions = this.websiteConstants.tableOptions;
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.currentBranch = JSON.parse(localStorage.getItem('branch'));
        this.getQueryParams();
        this.getVisitorsList();
    };
    VisitorListComponent.prototype.getQueryParams = function () {
        var _this = this;
        this.route.queryParams
            .filter(function (params) { return params.type; })
            .subscribe(function (params) {
            _this.queryParams.type = params.type;
        });
    };
    VisitorListComponent.prototype.getVisitorsList = function () {
        var params = {};
        if (this.form.value.type || this.form.value.start || this.form.value.end) {
            params = {
                'type': this.form.value.type,
                'start': this.form.value.start,
                'end': this.form.value.end,
                'page': 0,
                'limit': 0
            };
            this.getVisitors(params);
        }
        else if (this.queryParams) {
            params = {
                'type': this.queryParams.type,
                'page': 0,
                'limit': 0
            };
            this.getVisitors(params);
        }
        else
            this.getVisitors();
    };
    VisitorListComponent.prototype.redirectCheckin = function () {
        window.open(api_1.ApiConstants.checkinURL, "_blank");
    };
    VisitorListComponent.prototype.onResetForm = function () {
        this.form.reset();
        this.getVisitors();
    };
    VisitorListComponent.prototype.exportList = function (tableId, fileName) {
        this.exportService["export"](tableId, fileName);
    };
    VisitorListComponent.prototype.detail = function (visitor) {
        this.visitorDetail = visitor;
        this.showVisitorDetailModal = true; // Show-Hide Modal Check
    };
    VisitorListComponent.prototype.closePop = function (event) {
        this.visitorDetail = {};
        this.showVisitorDetailModal = false; // Show-Hide Modal Check
    };
    VisitorListComponent.prototype.print = function (visitorId) {
        if (visitorId && visitorId != undefined) {
            var url = "/visitor/pass/" + visitorId;
            window.open(url, '', 'height=550,width=600');
        }
    };
    VisitorListComponent.prototype.getFullName = function (firstName, lastName) {
        return firstName + ' ' + lastName;
    };
    VisitorListComponent.prototype.getVisitors = function (params) {
        var _this = this;
        this.SpinnerService.show();
        this.visitorService.getVisitors(params)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.visitors = res.data.visitors;
                if (_this.visitors)
                    _this.updateImagePath(_this.visitors);
                _this.visitorsTotal = _this.visitors.length;
                _this.isData = true;
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
    VisitorListComponent.prototype.updateImagePath = function (data) {
        data.forEach(function (value) {
            if (value.profileImagePath) {
                value.profileImagePath = api_1.ApiConstants.webURL + '/' + value.profileImagePath;
            }
            if (value.governmentIdUploadedImagePath && value.governmentIdUploadedImagePath !== null) {
                value.governmentIdUploadedImagePath = api_1.ApiConstants.webURL + '/' + value.governmentIdUploadedImagePath;
            }
            if (value.itemImageUploadedPath && value.itemImageUploadedPath !== null) {
                value.itemImageUploadedPath = api_1.ApiConstants.webURL + '/' + value.itemImageUploadedPath;
            }
        });
    };
    VisitorListComponent.prototype.signOut = function (id, visitor) {
        var _this = this;
        if (window.confirm(message_1.MessageConstants.visitorSignOutMessage)) {
            this.SpinnerService.show();
            visitor.signOut = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            this.visitorService.signOutVisitor(id, visitor)
                .subscribe(function (res) {
                _this.SpinnerService.hide();
                if (res.success == true && res.statusCode == 200) {
                    _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
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
        }
    };
    VisitorListComponent.prototype["delete"] = function (id, index) {
        var _this = this;
        if (window.confirm(message_1.MessageConstants.visitorDeleteMessage)) {
            this.SpinnerService.show();
            this.visitorService.deleteVisitor(id)
                .subscribe(function (res) {
                _this.SpinnerService.hide();
                if (res.success == true && res.statusCode == 200) {
                    _this.removeArrayData(index);
                    _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
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
        }
    };
    VisitorListComponent.prototype.removeArrayData = function (index) {
        if (index !== -1) {
            this.visitors.splice(index, 1);
        }
    };
    VisitorListComponent.prototype.backClicked = function () {
        this.visitorService.back();
    };
    __decorate([
        core_1.Input()
    ], VisitorListComponent.prototype, "latestSigninDetail");
    VisitorListComponent = __decorate([
        core_1.Component({
            selector: 'app-visitor-list',
            templateUrl: './visitor-list.component.html',
            styleUrls: ['./visitor-list.component.scss']
        })
    ], VisitorListComponent);
    return VisitorListComponent;
}());
exports.VisitorListComponent = VisitorListComponent;
