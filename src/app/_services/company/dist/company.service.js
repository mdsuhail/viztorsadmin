"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CompanyService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var api_1 = require("../../_common/constants/api");
var CompanyService = /** @class */ (function () {
    function CompanyService(http, _location) {
        this.http = http;
        this._location = _location;
    }
    CompanyService.prototype.getCompanies = function () {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companies;
        return this.http.get(apiUrl)
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    CompanyService.prototype.addCompany = function (company) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companies;
        return this.http.post(apiUrl, company).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    CompanyService.prototype.getCompany = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companyProfile + "/" + id;
        return this.http.get(apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    CompanyService.prototype.updateCompany = function (id, company) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companyProfile + "/" + id;
        return this.http.put(apiUrl, company).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    CompanyService.prototype.deleteCompany = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companyDelete + "/" + id;
        return this.http["delete"](apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    CompanyService.prototype.validateCompany = function (data) {
        if (data === void 0) { data = ''; }
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companyValidate;
        return this.http.post(apiUrl, data).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    CompanyService.prototype.back = function () {
        this._location.back();
    };
    // Error 
    CompanyService.prototype.handleError = function (error) {
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
    CompanyService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], CompanyService);
    return CompanyService;
}());
exports.CompanyService = CompanyService;
