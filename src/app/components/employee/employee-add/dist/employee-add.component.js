"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmployeeAddComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var EmployeeAddComponent = /** @class */ (function () {
    function EmployeeAddComponent(router, formBuilder, SpinnerService, toastr, employeeService, departmentService, routeService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this.employeeService = employeeService;
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
    EmployeeAddComponent.prototype.ngOnInit = function () {
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.websiteConstants = website_1.WebsiteConstants;
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
        this.getDepartments();
        this.form = this.formBuilder.group({
            firstname: ['', [forms_1.Validators.required]],
            lastname: ['', [forms_1.Validators.required]],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email, forms_1.Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            contact: ['', [forms_1.Validators.required]],
            company: [(this.currentUserCompany ? this.currentUserCompany._id : '')],
            department: [''],
            active: [true, [forms_1.Validators.required]],
            isVerified: [false]
        });
    };
    Object.defineProperty(EmployeeAddComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    EmployeeAddComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.SpinnerService.show();
        this.employeeService.addEmployee(this.form.value)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                _this.router.navigate(['/employee/list']);
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
    EmployeeAddComponent.prototype.getDepartments = function () {
        var _this = this;
        this.SpinnerService.show();
        this.departmentService.getDepartments()
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.departments = res.data.departments;
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
    EmployeeAddComponent.prototype.onReset = function () {
        this.submitted = false;
        this.form.reset();
    };
    EmployeeAddComponent.prototype.backClicked = function () {
        this.employeeService.back();
    };
    EmployeeAddComponent = __decorate([
        core_1.Component({
            selector: 'app-employee-add',
            templateUrl: './employee-add.component.html',
            styleUrls: ['./employee-add.component.scss']
        })
    ], EmployeeAddComponent);
    return EmployeeAddComponent;
}());
exports.EmployeeAddComponent = EmployeeAddComponent;
