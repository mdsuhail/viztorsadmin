"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var password_match_validators_1 = require("../_helpers/password-match.validators");
var message_1 = require("../_common/constants/message");
var angularx_social_login_1 = require("angularx-social-login");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(fb, authenticateService, authService, otpService, companyService, branchService, employeeService, userService, router, spinnerService, toastr) {
        this.fb = fb;
        this.authenticateService = authenticateService;
        this.authService = authService;
        this.otpService = otpService;
        this.companyService = companyService;
        this.branchService = branchService;
        this.employeeService = employeeService;
        this.userService = userService;
        this.router = router;
        this.spinnerService = spinnerService;
        this.toastr = toastr;
        this.formSubmitAttemptNewEmployee = false;
        this.formSubmitAttemptSocialLogin = false;
        this.submitted = false;
        this.loginOption = true;
        this.employeeFirstLoginButton = 'Check';
        this.isEmployee = false;
        this.isGoogleLogin = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.form = this.fb.group({
            email: ['', forms_1.Validators.required],
            password: ['', forms_1.Validators.required],
            isEmployee: [false]
        });
        this.formNewEmployee = this.fb.group({
            email: ['', forms_1.Validators.required],
            contact: [''],
            branch: [''],
            otp: [''],
            password: [''],
            confirmPassword: ['']
        }, {
            validator: password_match_validators_1.MustMatch('password', 'confirmPassword')
        });
        this.formSocialLogin = this.fb.group({
            email: [forms_1.Validators.required],
            contact: [''],
            branch: [''],
            otp: [''],
            password: [''],
            confirmPassword: ['']
        });
        this.authService.authState.subscribe(function (user) {
            if (user && _this.isGoogleLogin) {
                _this.user = user;
                _this.loginUserGoogle();
                // console.log(this.user);
            }
        });
    };
    LoginComponent.prototype.signInWithGoogle = function () {
        this.authService.signIn(angularx_social_login_1.GoogleLoginProvider.PROVIDER_ID);
    };
    LoginComponent.prototype.showSection = function (section) {
        if (section === void 0) { section = ''; }
        this.loginOption = section === 'loginOption' ? true : false;
        this.adminUserLogin = section === 'adminUserLogin' ? true : false;
        this.employeeLogin = section === 'employeeLogin' ? true : false;
        this.employeeFirstLogin = section === 'employeeFirstLogin' ? true : false;
        this.socialFirstLogin = section === 'socialFirstLogin' ? true : false;
    };
    LoginComponent.prototype.showFormSection = function (section) {
        if (section === void 0) { section = ''; }
        this.showEmail = section === 'showEmail' ? true : false;
        this.showBranch = section === 'showBranch' ? true : false;
        this.showContact = section === 'showContact' ? true : false;
        this.showOtp = section === 'showOtp' ? true : false;
        this.showPassword = section === 'showPassword' ? true : false;
    };
    LoginComponent.prototype.isFieldInvalid = function (field) {
        return ((!this.form.get(field).valid && this.form.get(field).touched) ||
            (this.form.get(field).untouched && this.formSubmitAttempt));
    };
    LoginComponent.prototype.isFieldInvalidNewEmployee = function (field) {
        return ((!this.formNewEmployee.get(field).valid && this.formNewEmployee.get(field).touched) ||
            (this.formNewEmployee.get(field).untouched && this.formSubmitAttemptNewEmployee));
    };
    LoginComponent.prototype.isFieldInvalidSocialLogin = function (field) {
        return ((!this.formSocialLogin.get(field).valid && this.formSocialLogin.get(field).touched) ||
            (this.formSocialLogin.get(field).untouched && this.formSubmitAttemptSocialLogin));
    };
    LoginComponent.prototype.toggleFieldTextType = function () {
        this.fieldTextType = !this.fieldTextType;
    };
    LoginComponent.prototype.onSubmit = function () {
        this.formSubmitAttempt = true;
        if (this.form.invalid) {
            return;
        }
        this.form.value.isEmployee = this.isEmployee;
        this.loginUser();
    };
    LoginComponent.prototype.onSubmitNewEmployee = function () {
        this.formSubmitAttemptNewEmployee = true;
        if (this.formNewEmployee.invalid) {
            return;
        }
        if (this.showEmail && this.showBranch) {
            this.branchDetail = this.formNewEmployee.value.branch;
            this.validateNewEmployeeBranch();
        }
        else if (this.showEmail) {
            this.validateNewEmployeeEmail();
        }
        else if (this.showContact) {
            if (this.formNewEmployee.value.contact == this.employeeDetail.contact)
                this.sendOtp();
            else
                this.toastr.error("Phone number mismatch, please contact administrator", 'Error', { timeOut: 4000 });
        }
        else if (this.showOtp) {
            this.verifyOtp();
        }
        else if (this.showPassword) {
            this.updateEmployeeVerificationStatus();
        }
    };
    LoginComponent.prototype.onSubmitSocialLogin = function () {
        this.formSubmitAttemptSocialLogin = true;
        if (this.formSocialLogin.invalid) {
            return;
        }
        if (this.showEmail && this.showBranch) {
            this.branchDetail = this.formSocialLogin.value.branch;
            this.validateNewEmployeeBranch();
        }
        else if (this.showEmail) {
            this.validateNewEmployeeEmail();
        }
        else if (this.showContact) {
            if (this.formSocialLogin.value.contact == this.employeeDetail.contact)
                this.sendOtp();
            else
                this.toastr.error("Phone number mismatch, please contact administrator", 'Error', { timeOut: 4000 });
        }
        else if (this.showOtp) {
            this.verifyOtp();
        }
        // else if (this.showPassword) {
        //   this.updateEmployeeVerificationStatus()
        // }
    };
    LoginComponent.prototype.validateNewEmployeeEmail = function () {
        var _this = this;
        var email = '';
        if (this.employeeFirstLogin)
            email = this.formNewEmployee.value.email;
        else if (this.isGoogleLogin)
            email = this.formSocialLogin.value.email;
        var data = {
            'email': email
        };
        this.spinnerService.show();
        this.companyService.validateCompany(data)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                if (res.data.valid) {
                    if (res.data.company.active) {
                        _this.companyDetail = res.data.company;
                        _this.toastr.success("Company found", 'Success', { timeOut: 4000 });
                        _this.getBranchesByCompanyIdForEmployeeValidation(res.data.company._id);
                    }
                    else
                        _this.toastr.error("Company account has been deactivated, please contact administrator", 'Error', { timeOut: 4000 });
                }
                else {
                    _this.toastr.error("Company not found, please contact administrator", 'Error', { timeOut: 4000 });
                }
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    LoginComponent.prototype.validateNewEmployeeBranch = function () {
        var _this = this;
        var email = '';
        if (this.employeeFirstLogin)
            email = this.formNewEmployee.value.email;
        else if (this.isGoogleLogin)
            email = this.formSocialLogin.value.email;
        var data = {
            'company': this.companyDetail.dbName,
            'branch': this.branchDetail.prefix,
            'email': email
        };
        this.spinnerService.show();
        this.employeeService.validateBranchEmployee(data)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                if (res.data.employee !== null) {
                    if (res.data.employee.active) {
                        if (res.data.employee.isVerified) {
                            _this.toastr.error("Account already verified", 'Error', { timeOut: 4000 });
                        }
                        else {
                            _this.employeeDetail = res.data.employee;
                            if (_this.employeeFirstLogin) {
                                var contactControl = _this.formNewEmployee.get('contact');
                                contactControl.setValidators([forms_1.Validators.required]);
                            }
                            else if (_this.isGoogleLogin) {
                                var contactControl = _this.formSocialLogin.get('contact');
                                contactControl.setValidators([forms_1.Validators.required]);
                            }
                            _this.showFormSection('showContact');
                        }
                    }
                    else
                        _this.toastr.error("Account with this mail has been deactivted, please contact administrator", 'Error', { timeOut: 4000 });
                }
                else {
                    _this.toastr.error("Detail not found in this branch, please contact administrator", 'Error', { timeOut: 4000 });
                }
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    LoginComponent.prototype.getBranchesByCompanyIdForEmployeeValidation = function (id) {
        var _this = this;
        if (id) {
            this.spinnerService.show();
            this.branchService.getBranchesByCompanyIdForEmployeeValidation(id)
                .subscribe(function (res) {
                _this.spinnerService.hide();
                if (res.success == true && res.statusCode == 200) {
                    _this.branches = res.data.branches;
                    if (_this.employeeFirstLogin) {
                        var branchControl = _this.formNewEmployee.get('branch');
                        branchControl.setValidators([forms_1.Validators.required]);
                    }
                    else if (_this.isGoogleLogin) {
                        var branchControl = _this.formSocialLogin.get('branch');
                        branchControl.setValidators([forms_1.Validators.required]);
                    }
                    _this.employeeFirstLoginButton = 'Next';
                    _this.showBranch = true;
                }
            }, function (err) {
                console.log(err);
                _this.spinnerService.hide();
            });
        }
    };
    LoginComponent.prototype.sendOtp = function () {
        var _this = this;
        this.loaderSpinnerMessage = message_1.MessageConstants.sendingOtpLoaderMessage;
        this.spinnerService.show();
        var contact = '';
        if (this.employeeFirstLogin)
            contact = this.formNewEmployee.value.contact;
        else if (this.isGoogleLogin)
            contact = this.formSocialLogin.value.contact;
        var data = {
            'comp_id': this.companyDetail._id,
            'company': this.companyDetail.dbName,
            'branch': this.branchDetail.prefix,
            'type': 'employee_contact_verification',
            'contact': contact
        };
        this.otpService.send(data)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 4000 });
                if (_this.employeeFirstLogin) {
                    var otpControl = _this.formNewEmployee.get('otp');
                    otpControl.setValidators([forms_1.Validators.required]);
                }
                else if (_this.isGoogleLogin) {
                    var otpControl = _this.formSocialLogin.get('otp');
                    otpControl.setValidators([forms_1.Validators.required]);
                }
                _this.showFormSection('showOtp');
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    LoginComponent.prototype.verifyOtp = function () {
        var _this = this;
        this.loaderSpinnerMessage = message_1.MessageConstants.verifyOtpLoaderMessage;
        this.spinnerService.show();
        var contact = '';
        var otp = '';
        if (this.employeeFirstLogin) {
            contact = this.formNewEmployee.value.contact;
            otp = this.formNewEmployee.value.otp;
        }
        else if (this.isGoogleLogin) {
            contact = this.formSocialLogin.value.contact;
            otp = this.formSocialLogin.value.otp;
        }
        var data = {
            'comp_id': this.companyDetail._id,
            'company': this.companyDetail.dbName,
            'branch': this.branchDetail.prefix,
            'contact': contact,
            'otp': otp
        };
        this.otpService.verify(data)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 4000 });
                if (_this.isGoogleLogin) {
                    _this.updateEmployeeVerificationStatus();
                }
                else {
                    var passwordControl = _this.formNewEmployee.get('password');
                    var confirmPasswordControl = _this.formNewEmployee.get('confirmPassword');
                    passwordControl.setValidators([forms_1.Validators.required]);
                    confirmPasswordControl.setValidators([forms_1.Validators.required]);
                    _this.employeeFirstLoginButton = 'Submit';
                    _this.showFormSection('showPassword');
                }
            }
            else if (res.success == false) {
                _this.toastr.error((res.message ? res.message : message_1.MessageConstants.serverError), 'Error', { timeOut: 3000 });
            }
            else {
                _this.toastr.error((res.message ? res.message : message_1.MessageConstants.serverError), 'Error', { timeOut: 4000 });
            }
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
            _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
        });
    };
    LoginComponent.prototype.updateEmployeeVerificationStatus = function () {
        var _this = this;
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.spinnerService.show();
        var contact = '';
        var email = '';
        if (this.employeeFirstLogin) {
            contact = this.formNewEmployee.value.contact;
            email = this.formNewEmployee.value.email;
        }
        else if (this.isGoogleLogin) {
            contact = this.formSocialLogin.value.contact;
            email = this.formSocialLogin.value.email;
        }
        var data = {
            'company': this.companyDetail.dbName,
            'branch': this.branchDetail.prefix,
            'contact': contact,
            'email': email,
            'isVerified': true
        };
        this.employeeService.updateEmployeeVerificationStatus(data)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.submitNewEmployeeProfile();
            }
            else if (res.success == false)
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            else
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 4000 });
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    LoginComponent.prototype.submitNewEmployeeProfile = function () {
        var _this = this;
        var contact = '';
        var email = '';
        var password = '';
        var confirmPassword = '';
        var provider = '';
        if (this.employeeFirstLogin) {
            contact = this.formNewEmployee.value.contact;
            email = this.formNewEmployee.value.email;
            provider = 'web';
            password = this.formNewEmployee.value.password;
            confirmPassword = this.formNewEmployee.value.confirmPassword;
        }
        else if (this.isGoogleLogin) {
            contact = this.formSocialLogin.value.contact;
            email = this.formSocialLogin.value.email;
            provider = 'google';
            password = this.formSocialLogin.value.password;
            confirmPassword = this.formSocialLogin.value.confirmPassword;
        }
        var data = {
            '_id': this.employeeDetail._id,
            'company': this.companyDetail._id,
            'branch': this.branchDetail._id,
            'role': 'employee',
            'firstname': this.employeeDetail.firstname,
            'lastname': this.employeeDetail.lastname,
            'email': email,
            'active': true,
            'provider': provider,
            'password': password,
            'confirmPassword': confirmPassword
        };
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.spinnerService.show();
        this.userService.registerEmployee(data)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 4000 });
                if (_this.isGoogleLogin) {
                    _this.loginUserGoogle();
                }
                else {
                    _this.isEmployee = true;
                    _this.showSection('employeeLogin');
                }
            }
            else if (res.success == false && res.statusCode == 200)
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            else
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 5000 });
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    LoginComponent.prototype.loginUser = function () {
        var _this = this;
        this.spinnerService.show();
        this.authenticateService.login(this.form.value)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                _this.authenticateService.setAccessToken(res.data.token);
                _this.getUserProfile(res.data.user._id);
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    LoginComponent.prototype.loginUserGoogle = function () {
        var _this = this;
        this.spinnerService.show();
        this.authenticateService.loginGoogle(this.user)
            .subscribe(function (res) {
            _this.spinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                _this.authenticateService.setAccessToken(res.data.token);
                _this.getUserProfile(res.data.user._id);
            }
            else if (res.success == false) {
                _this.toastr.error(res.message, 'Error', { timeOut: 4000 });
                // this.formSocialLogin.value.email = this.user.email
                _this.formSocialLogin.patchValue({
                    email: _this.user.email
                });
                _this.validateNewEmployeeEmail();
                _this.showSection('socialFirstLogin');
                _this.showFormSection('showEmail');
            }
            else {
                _this.toastr.error(message_1.MessageConstants.serverError, 'Error', { timeOut: 6000 });
            }
        }, function (err) {
            console.log(err);
            _this.spinnerService.hide();
        });
    };
    LoginComponent.prototype.getUserProfile = function (id) {
        var _this = this;
        this.authenticateService.getUserProfile(id)
            .subscribe(function (res) {
            _this.authenticateService.checkBrowser(res);
            _this.router.navigate(['/dashboard']);
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
