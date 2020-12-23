"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CompanyListComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var api_1 = require("../../../_common/constants/api");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var CompanyListComponent = /** @class */ (function () {
    function CompanyListComponent(http, SpinnerService, toastr, _location, routeService, router) {
        this.http = http;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this._location = _location;
        this.routeService = routeService;
        this.router = router;
        this.currentUser = {};
        this.currentUserRole = {};
        this.websiteConstants = {};
        this.dtOptions = {};
        this.isData = false;
        if (routeService.isRoutePermission !== true) {
            this.router.navigate(['error/unauthorized']);
        }
    }
    CompanyListComponent.prototype.ngOnInit = function () {
        this.websiteConstants = website_1.WebsiteConstants;
        this.dtOptions = this.websiteConstants.tableOptions;
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        //this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.getCompanies();
    };
    CompanyListComponent.prototype.getCompanies = function () {
        var _this = this;
        this.SpinnerService.show();
        var apiUrl = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companies;
        this.http.get(apiUrl).subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.companies = res.data.companies;
                if (_this.companies)
                    _this.updateImagePath(_this.companies);
                _this.companiesTotal = _this.companies.length;
                _this.isData = true;
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
            operators_1.catchError(_this.handleError);
        });
    };
    CompanyListComponent.prototype.updateImagePath = function (data) {
        data.forEach(function (value) {
            if (value.logo) {
                value.logo = api_1.ApiConstants.webURL + '/' + value.logo;
            }
        });
    };
    CompanyListComponent.prototype["delete"] = function (id, index) {
        var _this = this;
        if (window.confirm(message_1.MessageConstants.companyDeleteMessage)) {
            this.SpinnerService.show();
            this.http["delete"](api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companyDelete + "/" + id)
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
                    operators_1.catchError(_this.handleError);
                }
            });
        }
    };
    CompanyListComponent.prototype.removeArrayData = function (index) {
        if (index !== -1) {
            this.companies.splice(index, 1);
        }
    };
    CompanyListComponent.prototype.backClicked = function () {
        this._location.back();
    };
    // Error 
    CompanyListComponent.prototype.handleError = function (error) {
        var msg = '';
        if (error.error instanceof ErrorEvent) {
            // client-side error
            msg = error.error.message;
        }
        else {
            // server-side error
            msg = "Error Code: " + error.status + "\nMessage: " + error.message;
        }
        return rxjs_1.throwError(msg);
    };
    CompanyListComponent = __decorate([
        core_1.Component({
            selector: 'app-company-list',
            templateUrl: './company-list.component.html',
            styleUrls: ['./company-list.component.scss']
        })
    ], CompanyListComponent);
    return CompanyListComponent;
}());
exports.CompanyListComponent = CompanyListComponent;
