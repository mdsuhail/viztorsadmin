"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BranchService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var api_1 = require("../../_common/constants/api");
var BranchService = /** @class */ (function () {
    function BranchService(http, _location) {
        this.http = http;
        this._location = _location;
    }
    BranchService.prototype.getBranches = function () {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.branches;
        return this.http.get(apiUrl)
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    BranchService.prototype.addBranch = function (branch) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.branches;
        return this.http.post(apiUrl, branch).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    BranchService.prototype.getBranch = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.branchProfile + "/" + id;
        return this.http.get(apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    BranchService.prototype.getBranchesByCompanyId = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.branches + "/" + id + '/company';
        return this.http.get(apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    BranchService.prototype.getBranchesByCompanyIdForEmployeeValidation = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.branches + "/" + id + '/company/employee/validation';
        return this.http.get(apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    BranchService.prototype.updateBranch = function (id, branch) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.branchProfile + "/" + id;
        return this.http.put(apiUrl, branch).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    BranchService.prototype.deleteBranch = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.branchDelete + "/" + id;
        return this.http["delete"](apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    BranchService.prototype.back = function () {
        this._location.back();
    };
    // Error 
    BranchService.prototype.handleError = function (error) {
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
    BranchService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], BranchService);
    return BranchService;
}());
exports.BranchService = BranchService;
