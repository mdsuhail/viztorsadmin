"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserAddComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var forms_1 = require("@angular/forms");
var api_1 = require("../../../_common/constants/api");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var password_match_validators_1 = require("../../../_helpers/password-match.validators");
var UserAddComponent = /** @class */ (function () {
    function UserAddComponent(http, router, formBuilder, SpinnerService, toastr, _location, branchService, routeService) {
        this.http = http;
        this.router = router;
        this.formBuilder = formBuilder;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this._location = _location;
        this.branchService = branchService;
        this.routeService = routeService;
        this.submitted = false;
        this.showBranch = false;
        this.currentUserRole = {};
        this.currentUserCompany = {};
        this.currentUserBranch = {};
        this.websiteConstants = {};
        this.selectedRole = {};
        if (routeService.isRoutePermission !== true) {
            this.router.navigate(['error/unauthorized']);
        }
    }
    UserAddComponent.prototype.ngOnInit = function () {
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.websiteConstants = website_1.WebsiteConstants;
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.getCompanies();
        this.getRoles();
        this.form = this.formBuilder.group({
            company: ['', forms_1.Validators.required],
            branch: [''],
            role: ['', forms_1.Validators.required],
            firstname: ['', forms_1.Validators.required],
            lastname: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            active: [true, [forms_1.Validators.required]],
            password: ['', [forms_1.Validators.required, forms_1.Validators.minLength(6)]],
            confirmPassword: ['', forms_1.Validators.required]
        }, {
            validator: password_match_validators_1.MustMatch('password', 'confirmPassword')
        });
        if (this.currentUserRole.name !== 'superadmin') {
            this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
            this.form.controls.company.setValue(this.currentUserCompany._id);
        }
        if (this.currentUserRole.name === 'companyadmin') {
            this.getBranchesByCompanyId(this.currentUserCompany._id);
        }
        if (this.currentUserRole.name === 'branchadmin') {
            this.currentUserBranch = JSON.parse(localStorage.getItem('branch'));
        }
    };
    UserAddComponent.prototype.toggleFieldTextType = function () {
        this.fieldTextType = !this.fieldTextType;
    };
    UserAddComponent.prototype.getCompanies = function () {
        var _this = this;
        var apiUrl = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companies;
        this.http.get(apiUrl).subscribe(function (res) {
            if (res.success == true && res.statusCode == 200) {
                _this.companies = res.data.companies;
            }
            operators_1.catchError(_this.handleError);
        });
    };
    UserAddComponent.prototype.getRoles = function () {
        var _this = this;
        var apiUrl = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.roles;
        this.http.get(apiUrl).subscribe(function (res) {
            if (res.success == true && res.statusCode == 200) {
                _this.roles = res.data.roles;
            }
            operators_1.catchError(_this.handleError);
        });
    };
    UserAddComponent.prototype.getBranchesByCompanyId = function (id) {
        var _this = this;
        if (id) {
            this.SpinnerService.show();
            this.branchService.getBranchesByCompanyId(id)
                .subscribe(function (res) {
                _this.SpinnerService.hide();
                if (res.success == true && res.statusCode == 200) {
                    _this.branches = res.data.branches;
                }
            }, function (err) {
                console.log(err);
                _this.SpinnerService.hide();
            });
        }
    };
    UserAddComponent.prototype.onSelectRole = function (selectedRole) {
        var branchControl = this.form.get('branch');
        this.selectedRole = selectedRole;
        if (selectedRole && (selectedRole.name === 'branchadmin' || selectedRole.name === 'user') && (this.currentUserRole.name === 'superadmin' || this.currentUserRole.name === 'companyadmin')) {
            this.showBranch = true;
            branchControl.setValidators([forms_1.Validators.required]);
            //this.form.value.role = selectedRole._id;
        }
        else {
            this.showBranch = false;
            branchControl.setValidators(null);
            //this.form.value.role = '';
            this.form.controls.branch.setValue('');
        }
    };
    Object.defineProperty(UserAddComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    UserAddComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.updateRoleId();
        if (this.currentUserRole.name === 'branchadmin')
            this.updateBranchId();
        // submit form on success
        this.SpinnerService.show();
        return this.http.post(api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.userRegister, this.form.value)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                // if (this.currentUserRole.name == 'superadmin')
                //   this.router.navigate(['/company/list']);
                // else
                _this.router.navigate(['/user/list']);
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
    UserAddComponent.prototype.updateRoleId = function () {
        this.form.value.role = this.form.value.role._id;
    };
    UserAddComponent.prototype.updateBranchId = function () {
        this.form.value.branch = this.currentUserBranch._id;
    };
    UserAddComponent.prototype.onReset = function () {
        this.submitted = false;
        this.form.reset();
    };
    UserAddComponent.prototype.backClicked = function () {
        this._location.back();
    };
    // Error 
    UserAddComponent.prototype.handleError = function (error) {
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
    UserAddComponent = __decorate([
        core_1.Component({
            selector: 'app-user-add',
            templateUrl: './user-add.component.html',
            styleUrls: ['./user-add.component.scss']
        })
    ], UserAddComponent);
    return UserAddComponent;
}());
exports.UserAddComponent = UserAddComponent;
