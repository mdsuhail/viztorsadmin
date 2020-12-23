"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OtpService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var api_1 = require("../../_common/constants/api");
var OtpService = /** @class */ (function () {
    function OtpService(http, _location) {
        this.http = http;
        this._location = _location;
    }
    OtpService.prototype.send = function (queryParams) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.otpSendForEmployeeValidation;
        var params = new http_1.HttpParams();
        if (queryParams) {
            params = params.append('comp_id', queryParams.comp_id ? queryParams.comp_id : '');
            params = params.append('company', queryParams.company ? queryParams.company : '');
            params = params.append('prefix', queryParams.branch ? queryParams.branch : '');
            params = params.append('type', queryParams.type ? queryParams.type : '');
            params = params.append('contact', queryParams.contact ? queryParams.contact : '');
        }
        return this.http.get(apiUrl, { params: params })
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    OtpService.prototype.verify = function (queryParams) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.otpVerifyForEmployeeValidation;
        var params = new http_1.HttpParams();
        if (queryParams) {
            params = params.append('comp_id', queryParams.comp_id ? queryParams.comp_id : '');
            params = params.append('company', queryParams.company ? queryParams.company : '');
            params = params.append('prefix', queryParams.branch ? queryParams.branch : '');
            params = params.append('contact', queryParams.contact ? queryParams.contact : '');
            params = params.append('otp', queryParams.otp ? queryParams.otp : '');
        }
        return this.http.get(apiUrl, { params: params })
            .pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    // Error
    OtpService.prototype.handleError = function (error) {
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
    OtpService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], OtpService);
    return OtpService;
}());
exports.OtpService = OtpService;
