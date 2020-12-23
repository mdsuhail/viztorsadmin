"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthenticateService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var api_1 = require("../_common/constants/api");
var message_1 = require("../_common/constants/message");
var AuthenticateService = /** @class */ (function () {
    function AuthenticateService(platform, http, router, toastr, SpinnerService, location) {
        this.platform = platform;
        this.http = http;
        this.router = router;
        this.toastr = toastr;
        this.SpinnerService = SpinnerService;
        this.location = location;
        this.currentUserResources = [];
    }
    AuthenticateService.prototype.isAuthenticated = function () {
        var userData = localStorage.getItem('userInfo');
        if (userData && JSON.parse(userData)) {
            return true;
        }
        return false;
    };
    AuthenticateService.prototype.setAccessToken = function (token) {
        localStorage.setItem('access_token', token);
    };
    AuthenticateService.prototype.setUserInfo = function (detail) {
        localStorage.setItem('user', JSON.stringify(detail.data.user));
        localStorage.setItem('company', JSON.stringify(detail.data.company));
        localStorage.setItem('branch', JSON.stringify(detail.data.branch));
        localStorage.setItem('role', JSON.stringify(detail.data.role));
        localStorage.setItem('resources', JSON.stringify(detail.data.resources));
        localStorage.setItem('resourcePermissions', JSON.stringify(detail.data.resourcePermissions));
    };
    AuthenticateService.prototype.getToken = function () {
        return localStorage.getItem('access_token');
    };
    AuthenticateService.prototype.getLocalData = function (dataKey) {
        if (dataKey === void 0) { dataKey = ''; }
        return localStorage.getItem(dataKey);
    };
    AuthenticateService.prototype.setLocalData = function (dataKey, data) {
        if (dataKey === void 0) { dataKey = ''; }
        return localStorage.setItem(dataKey, JSON.stringify(data));
    };
    // register
    AuthenticateService.prototype.signUp = function (user) {
        var api = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/register";
        return this.http.post(api, user)
            .pipe(operators_1.catchError(this.handleError));
    };
    // login
    AuthenticateService.prototype.login = function (user) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.userLogin;
        return this.http.post(apiUrl, user).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    // loginGoogle
    AuthenticateService.prototype.loginGoogle = function (user) {
        var apiUrl = api_1.ApiConstants.baseURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.userLoginGoogle;
        return this.http.post(apiUrl, user).pipe(operators_1.tap(), operators_1.catchError(this.handleError));
    };
    AuthenticateService.prototype.checkBrowser = function (detail) {
        if (detail.data.branch !== null && detail.data.branch.length !== 0) {
            detail.data.branch.isTouchlessData = detail.data.branch.isTouchless;
            if (this.platform.isBrowser) {
                detail.data.branch.isTouchless = false;
            }
        }
        this.setUserInfo(detail);
    };
    // User profile
    AuthenticateService.prototype.getUserProfile = function (id) {
        var api = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.userProfile + "/" + id;
        return this.http.get(api).pipe(operators_1.map(function (res) {
            return res || {};
        }), operators_1.catchError(this.handleError));
    };
    AuthenticateService.prototype.logout = function () {
        localStorage.removeItem('user');
        localStorage.removeItem('company');
        localStorage.removeItem('branch');
        localStorage.removeItem('role');
        localStorage.removeItem('resources');
        localStorage.removeItem('resourcePermissions');
        this.toastr.success(message_1.MessageConstants.logout, 'Succeess', { timeOut: 3000 });
        var removeToken = localStorage.removeItem('access_token');
        if (removeToken == null) {
            this.router.navigate(['login']);
        }
    };
    Object.defineProperty(AuthenticateService.prototype, "isLoggedIn", {
        get: function () {
            var authToken = localStorage.getItem('access_token');
            return (authToken !== null) ? true : false;
        },
        enumerable: false,
        configurable: true
    });
    // Error 
    AuthenticateService.prototype.handleError = function (error) {
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
    AuthenticateService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthenticateService);
    return AuthenticateService;
}());
exports.AuthenticateService = AuthenticateService;
