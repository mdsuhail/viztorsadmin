"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProfileComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var forms_1 = require("@angular/forms");
var api_1 = require("../../../_common/constants/api");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var password_match_validators_1 = require("../../../_helpers/password-match.validators");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(http, route, router, formBuilder, SpinnerService, toastr, _location) {
        this.http = http;
        this.route = route;
        this.router = router;
        this.formBuilder = formBuilder;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this._location = _location;
        this.submitted = false;
        this.userData = {};
        this.currentUser = {};
        this.currentUserRole = {};
        this.websiteConstants = {};
        this.currentUserCompany = {};
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.websiteConstants = website_1.WebsiteConstants;
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        if (this.currentUser._id) {
            var id = this.currentUser._id;
            this.getUserProfile(id);
        }
        ;
        //this.getCompanies();
        this.getRoles();
        this.form = this.formBuilder.group({
            company: ['', forms_1.Validators.required],
            branch: [''],
            role: ['', forms_1.Validators.required],
            firstname: ['', forms_1.Validators.required],
            lastname: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            active: [true, [forms_1.Validators.required]],
            password: [''],
            confirmPassword: ['']
        }, {
            validator: password_match_validators_1.MustMatch('password', 'confirmPassword')
        });
        if (this.currentUserRole.name != 'superadmin') {
            this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
            this.form.controls.company.setValue(this.currentUserCompany._id);
        }
    };
    ProfileComponent.prototype.toggleFieldTextType = function () {
        this.fieldTextType = !this.fieldTextType;
    };
    // getCompanies() {
    //   let apiUrl = `${ApiConstants.apiURL}/${ApiConstants.apiVersion}/${ApiConstants.companies}`;
    //   this.http.get(apiUrl).subscribe((res: any) => {
    //     if (res.success == true && res.statusCode == 200) {
    //       this.companies = res.data.companies;
    //     }
    //     catchError(this.handleError)
    //   });
    // }
    ProfileComponent.prototype.getRoles = function () {
        var _this = this;
        var apiUrl = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.roles + '?type=all';
        this.http.get(apiUrl).subscribe(function (res) {
            if (res.success == true && res.statusCode == 200) {
                _this.roles = res.data.roles;
            }
            operators_1.catchError(_this.handleError);
        });
    };
    // User profile
    ProfileComponent.prototype.getUserProfile = function (id) {
        var _this = this;
        var apiUrl = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.userProfile + "/" + id;
        this.http.get(apiUrl).subscribe(function (res) {
            if (res.success == true && res.statusCode == 200) {
                _this.userData = res.data;
                _this.setDetail(_this.userData);
            }
            operators_1.catchError(_this.handleError);
        });
    };
    ProfileComponent.prototype.setDetail = function (userData) {
        this.form.setValue({
            company: userData.company._id,
            branch: userData.branch && userData.branch !== null && Object.keys(userData.branch).length > 0 ? userData.branch._id : '',
            role: userData.role._id,
            firstname: userData.user.firstname,
            lastname: userData.user.lastname,
            email: userData.user.email,
            active: userData.user.active,
            password: '',
            confirmPassword: ''
        });
    };
    Object.defineProperty(ProfileComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    ProfileComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        // submit form on success
        this.SpinnerService.show();
        var id = this.userData.user._id;
        this.http.put(api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.userProfile + "/" + id, this.form.value)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                //this.router.navigate(['/']);
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
                operators_1.catchError(_this.handleError);
            }
        });
    };
    ProfileComponent.prototype.onReset = function () {
        this.submitted = false;
        this.form.reset();
    };
    ProfileComponent.prototype.backClicked = function () {
        this._location.back();
    };
    // Error 
    ProfileComponent.prototype.handleError = function (error) {
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
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.scss']
        })
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
