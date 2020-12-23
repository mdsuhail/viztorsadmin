"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CompanyAddComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var forms_1 = require("@angular/forms");
var api_1 = require("../../../_common/constants/api");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var CompanyAddComponent = /** @class */ (function () {
    function CompanyAddComponent(http, router, formBuilder, SpinnerService, toastr, _location, routeService) {
        this.http = http;
        this.router = router;
        this.formBuilder = formBuilder;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this._location = _location;
        this.routeService = routeService;
        this.submitted = false;
        this.websiteConstants = {};
        if (routeService.isRoutePermission !== true) {
            this.router.navigate(['error/unauthorized']);
        }
    }
    CompanyAddComponent.prototype.ngOnInit = function () {
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.websiteConstants = website_1.WebsiteConstants;
        this.form = this.formBuilder.group({
            name: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            emailDomain: ['', [forms_1.Validators.required]],
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
    CompanyAddComponent.prototype.onFileChange = function ($event) {
        this.readThis($event.target);
    };
    CompanyAddComponent.prototype.readThis = function (inputValue) {
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
    Object.defineProperty(CompanyAddComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    CompanyAddComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        // submit form on success
        this.SpinnerService.show();
        return this.http.post(api_1.ApiConstants.apiURL + "/" + api_1.ApiConstants.apiVersion + "/" + api_1.ApiConstants.companies, this.form.value)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                _this.router.navigate(['/company/list']);
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
    CompanyAddComponent.prototype.onReset = function () {
        this.submitted = false;
        this.form.reset();
    };
    CompanyAddComponent.prototype.backClicked = function () {
        this._location.back();
    };
    // Error 
    CompanyAddComponent.prototype.handleError = function (error) {
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
    CompanyAddComponent = __decorate([
        core_1.Component({
            selector: 'app-company-add',
            templateUrl: './company-add.component.html',
            styleUrls: ['./company-add.component.scss']
        })
    ], CompanyAddComponent);
    return CompanyAddComponent;
}());
exports.CompanyAddComponent = CompanyAddComponent;
