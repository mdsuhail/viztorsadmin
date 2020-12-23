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
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(http, router, route, formBuilder, SpinnerService, toastr, _location, authService) {
        this.http = http;
        this.router = router;
        this.route = route;
        this.formBuilder = formBuilder;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this._location = _location;
        this.authService = authService;
        this.submitted = false;
        this.websiteConstants = {};
        this.currentUserCompany = {};
        this.data = {};
    }
    ProfileComponent.prototype.ngOnInit = function () {
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
        this.websiteConstants = website_1.WebsiteConstants;
        if (this.currentUserCompany._id) {
            var id = this.currentUserCompany._id;
            this.getProfile(id);
        }
        this.form = this.formBuilder.group({
            name: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            contact: [''],
            address: [''],
            city: [''],
            state: [''],
            zip: [''],
            logo: [''],
            website: [''],
            image: [''],
            active: [true, [forms_1.Validators.required]]
        });
    };
    // Company profile
    ProfileComponent.prototype.getProfile = function (id) {
        var _this = this;
        var apiUrl = api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companyProfile + "/" + id;
        this.http.get(apiUrl).subscribe(function (res) {
            if (res.success == true && res.statusCode == 200) {
                _this.data = res.data.company;
                _this.setDetail(_this.data);
            }
            operators_1.catchError(_this.handleError);
        });
    };
    ProfileComponent.prototype.setDetail = function (data) {
        this.form.setValue({
            name: data.name,
            email: data.email,
            contact: data.contact,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            logo: data.logo,
            website: data.website,
            image: data.image ? data.image : '',
            active: data.active
        });
        this.logoUrl = data.logo ? api_1.ApiConstants.webURL + '/' + data.logo : '';
    };
    ProfileComponent.prototype.onFileChange = function ($event) {
        this.readThis($event.target);
    };
    ProfileComponent.prototype.readThis = function (inputValue) {
        var _this = this;
        var file = inputValue.files[0];
        if (file && file !== undefined) {
            var myReader = new FileReader();
            myReader.onloadend = function (e) {
                var image = myReader.result;
                _this.form.patchValue({
                    image: image
                });
            };
            myReader.readAsDataURL(file);
        }
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
        var id = this.data._id;
        this.http.put(api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companyProfile + "/" + id, this.form.value)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                _this.authService.setLocalData('company', res.data.company);
                window.location.reload(true);
                //this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };
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
