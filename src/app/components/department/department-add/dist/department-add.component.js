"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DepartmentAddComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var DepartmentAddComponent = /** @class */ (function () {
    function DepartmentAddComponent(router, formBuilder, SpinnerService, toastr, departmentService, routeService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this.departmentService = departmentService;
        this.routeService = routeService;
        this.submitted = false;
        this.websiteConstants = {};
        this.currentUserRole = {};
        this.currentUserCompany = {};
        if (routeService.isRoutePermission !== true) {
            this.router.navigate(['error/unauthorized']);
        }
    }
    DepartmentAddComponent.prototype.ngOnInit = function () {
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.websiteConstants = website_1.WebsiteConstants;
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
        this.form = this.formBuilder.group({
            name: ['', forms_1.Validators.required],
            description: [''],
            company: [(this.currentUserCompany ? this.currentUserCompany._id : '')],
            "default": [(this.currentUserRole.name == 'superadmin' ? true : false)],
            active: [true, [forms_1.Validators.required]]
        });
    };
    Object.defineProperty(DepartmentAddComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    DepartmentAddComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.SpinnerService.show();
        this.departmentService.addDepartment(this.form.value)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                _this.router.navigate(['/department/list']);
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.SpinnerService.hide();
        });
    };
    DepartmentAddComponent.prototype.onReset = function () {
        this.submitted = false;
        this.form.reset();
    };
    DepartmentAddComponent.prototype.backClicked = function () {
        this.departmentService.back();
    };
    DepartmentAddComponent = __decorate([
        core_1.Component({
            selector: 'app-department-add',
            templateUrl: './department-add.component.html',
            styleUrls: ['./department-add.component.scss']
        })
    ], DepartmentAddComponent);
    return DepartmentAddComponent;
}());
exports.DepartmentAddComponent = DepartmentAddComponent;
