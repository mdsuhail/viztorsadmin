"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmployeeService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var api_1 = require("../../_common/constants/api");
var EmployeeService = /** @class */ (function () {
    function EmployeeService(http, _location) {
        this.http = http;
        this._location = _location;
    }
    EmployeeService.prototype.getEmployees = function () {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employees;
        return this.http.get(apiUrl)
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.addEmployee = function (employee) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employees;
        return this.http.post(apiUrl, employee).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.addEmployees = function (employee) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employeesImport;
        return this.http.post(apiUrl, employee).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.getEmployee = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employeeProfile + "/" + id;
        return this.http.get(apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.updateEmployee = function (id, employee) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employeeProfile + "/" + id;
        return this.http.put(apiUrl, employee).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.deleteEmployee = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employeeDelete + "/" + id;
        return this.http["delete"](apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.validateBranchEmployee = function (queryParams) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employees + '/validation';
        var params = new http_1.HttpParams();
        if (queryParams) {
            params = params.append('company', queryParams.company ? queryParams.company : '');
            params = params.append('prefix', queryParams.branch ? queryParams.branch : '');
            params = params.append('email', queryParams.email ? queryParams.email : '');
        }
        return this.http.get(apiUrl, { params: params })
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.updateEmployeeVerificationStatus = function (data) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.employees + '/validation/status/update';
        var params = new http_1.HttpParams();
        if (data) {
            params = params.append('company', data.company ? data.company : '');
            params = params.append('prefix', data.branch ? data.branch : '');
        }
        return this.http.put(apiUrl, data, { params: params })
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    EmployeeService.prototype.back = function () {
        this._location.back();
    };
    // Error 
    EmployeeService.prototype.handleError = function (error) {
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
    EmployeeService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], EmployeeService);
    return EmployeeService;
}());
exports.EmployeeService = EmployeeService;
