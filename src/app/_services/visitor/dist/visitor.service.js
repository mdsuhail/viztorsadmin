"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VisitorService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var api_1 = require("../../_common/constants/api");
var VisitorService = /** @class */ (function () {
    function VisitorService(http, _location) {
        this.http = http;
        this._location = _location;
    }
    VisitorService.prototype.getVisitors = function (queryParams) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.visitors;
        var params = new http_1.HttpParams();
        if (queryParams) {
            params = params.append('start', queryParams.start ? queryParams.start : '');
            params = params.append('end', queryParams.end ? queryParams.end : '');
            params = params.append('type', queryParams.type ? queryParams.type : '');
            params = params.append('page', queryParams.page ? queryParams.page : '');
            params = params.append('limit', queryParams.limit ? queryParams.limit : '');
            params = params.append('branch', queryParams.branch ? queryParams.branch : '');
            params = params.append('prefix', queryParams.prefix ? queryParams.prefix : '');
        }
        return this.http.get(apiUrl, { params: params })
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    VisitorService.prototype.preApproved = function (visitor) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.visitorsPreApproved;
        return this.http.post(apiUrl, visitor)
            .pipe(operators_1.timeout(18000), operators_1.catchError(function (err) {
            return rxjs_1.throwError("Error in Response");
        }));
    };
    VisitorService.prototype.getVisitor = function (id, queryParams) {
        var params = new http_1.HttpParams();
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.visitorProfile + "/" + id;
        if (queryParams) {
            params = params.append('branch', queryParams.branch ? queryParams.branch : '');
            params = params.append('prefix', queryParams.prefix ? queryParams.prefix : '');
        }
        return this.http.get(apiUrl, { params: params })
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    VisitorService.prototype.getVisitorByFace = function (data) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.visitorDetailByFaceData;
        return this.http.post(apiUrl, data).pipe(operators_1.timeout(15000), operators_1.catchError(function (err) {
            return rxjs_1.throwError("Error in Response");
        }));
    };
    VisitorService.prototype.getProfileByContact = function (contact) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.visitorProfileByContact + "/" + contact;
        return this.http.get(apiUrl)
            .pipe(operators_1.catchError(function (err) {
            return rxjs_1.throwError("Error in Response");
        }));
    };
    VisitorService.prototype.deleteVisitor = function (id) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.visitorDelete + "/" + id;
        return this.http["delete"](apiUrl).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    VisitorService.prototype.signOutVisitor = function (id, visitor) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.visitorSignOut + "/" + id;
        return this.http.put(apiUrl, visitor).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    VisitorService.prototype.back = function () {
        this._location.back();
    };
    // Error 
    VisitorService.prototype.handleError = function (error) {
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
    VisitorService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], VisitorService);
    return VisitorService;
}());
exports.VisitorService = VisitorService;
