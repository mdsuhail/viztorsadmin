import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticateService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { MustMatch } from '../_helpers/password-match.validators';
import { MessageConstants } from '../_common/constants/message';
import { CompanyService } from './../_services/company/company.service';
import { BranchService } from './../_services/branch/branch.service';
import { EmployeeService } from './../_services/employee/employee.service';
import { UserService } from './../_services/user/user.service';
import { OtpService } from './../_services/otp/otp.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { AuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  formNewEmployee: FormGroup;
  formSocialLogin: FormGroup;
  private formSubmitAttempt: boolean;
  formSubmitAttemptNewEmployee = false;
  formSubmitAttemptSocialLogin = false;
  submitted = false;
  email: String;
  password: String;
  loaderSpinnerMessage: String;
  fieldTextType: boolean;
  loginOption = true;
  employeeLogin: boolean;
  adminUserLogin: boolean;
  employeeFirstLogin: boolean;
  socialFirstLogin: boolean;
  showContact: boolean;
  showOtp: boolean;
  showEmail: boolean;
  showBranch: boolean;
  showPassword: boolean
  branches: []
  employeeFirstLoginButton = 'Check'
  companyDetail: any
  branchDetail: any
  employeeDetail: any
  isEmployee = false
  isGoogleLogin = false
  user: SocialUser

  constructor(
    private fb: FormBuilder,
    private authenticateService: AuthenticateService,
    private authService: AuthService,
    private otpService: OtpService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private employeeService: EmployeeService,
    private userService: UserService,
    private router: Router,
    public spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      isEmployee: [false],
    });
    this.formNewEmployee = this.fb.group({
      email: ['', Validators.required],
      contact: [''],
      branch: [''],
      otp: [''],
      password: [''],
      confirmPassword: [''],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.formSocialLogin = this.fb.group({
      email: [Validators.required],
      contact: [''],
      branch: [''],
      otp: [''],
      password: [''],
      confirmPassword: ['']
    });

    this.authService.authState.subscribe((user) => {
      if (user && this.isGoogleLogin) {
        this.user = user;
        this.loginUserGoogle()
        // console.log(this.user);
      }
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  showSection(section = '') {
    this.loginOption = section === 'loginOption' ? true : false;
    this.adminUserLogin = section === 'adminUserLogin' ? true : false;
    this.employeeLogin = section === 'employeeLogin' ? true : false;
    this.employeeFirstLogin = section === 'employeeFirstLogin' ? true : false;
    this.socialFirstLogin = section === 'socialFirstLogin' ? true : false;
  }

  showFormSection(section = '') {
    this.showEmail = section === 'showEmail' ? true : false;
    this.showBranch = section === 'showBranch' ? true : false;
    this.showContact = section === 'showContact' ? true : false;
    this.showOtp = section === 'showOtp' ? true : false;
    this.showPassword = section === 'showPassword' ? true : false;
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  isFieldInvalidNewEmployee(field: string) {
    return (
      (!this.formNewEmployee.get(field).valid && this.formNewEmployee.get(field).touched) ||
      (this.formNewEmployee.get(field).untouched && this.formSubmitAttemptNewEmployee)
    );
  }

  isFieldInvalidSocialLogin(field: string) {
    return (
      (!this.formSocialLogin.get(field).valid && this.formSocialLogin.get(field).touched) ||
      (this.formSocialLogin.get(field).untouched && this.formSubmitAttemptSocialLogin)
    );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmit() {
    this.formSubmitAttempt = true;
    if (this.form.invalid) {
      return
    }
    this.form.value.isEmployee = this.isEmployee
    this.loginUser();
  }

  onSubmitNewEmployee() {
    this.formSubmitAttemptNewEmployee = true;
    if (this.formNewEmployee.invalid) {
      return
    }
    if (this.showEmail && this.showBranch) {
      this.branchDetail = this.formNewEmployee.value.branch
      this.validateNewEmployeeBranch()
    } else if (this.showEmail) {
      this.validateNewEmployeeAlreadyRegisered()
    } else if (this.showContact) {
      if (this.formNewEmployee.value.contact == this.employeeDetail.contact)
        this.sendOtp()
      else
        this.toastr.error("Phone number mismatch, please contact administrator", 'Error', { timeOut: 4000 })
    } else if (this.showOtp) {
      this.verifyOtp()
    } else if (this.showPassword) {
      this.updateEmployeeVerificationStatus()
    }
  }

  onSubmitSocialLogin() {
    this.formSubmitAttemptSocialLogin = true;
    if (this.formSocialLogin.invalid) {
      return
    }
    if (this.showEmail && this.showBranch) {
      this.branchDetail = this.formSocialLogin.value.branch
      this.validateNewEmployeeBranch()
    } else if (this.showEmail) {
      this.validateNewEmployeeEmail()
    } else if (this.showContact) {
      if (this.formSocialLogin.value.contact == this.employeeDetail.contact)
        this.sendOtp()
      else
        this.toastr.error("Phone number mismatch, please contact administrator", 'Error', { timeOut: 4000 })
    } else if (this.showOtp) {
      this.verifyOtp()
    }
    // else if (this.showPassword) {
    //   this.updateEmployeeVerificationStatus()
    // }
  }

  validateNewEmployeeAlreadyRegisered() {
    var email = ''
    if (this.employeeFirstLogin)
      email = this.formNewEmployee.value.email
    else if (this.isGoogleLogin)
      email = this.formSocialLogin.value.email

    this.spinnerService.show();
    this.userService.getUserByEmail(email)
      .subscribe((res: any) => {
        if (res.success == true && res.statusCode == 200) {
          this.toastr.error("Account already registered, please login", 'Error', { timeOut: 4000 })
          this.showSection('employeeLogin')
          this.spinnerService.hide();
        } else if (res.success == false) {
          this.validateNewEmployeeEmail();
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
          this.spinnerService.hide();
        }
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
  }

  validateNewEmployeeEmail() {
    var email = ''
    if (this.employeeFirstLogin)
      email = this.formNewEmployee.value.email
    else if (this.isGoogleLogin)
      email = this.formSocialLogin.value.email
    var data: any = {
      'email': email
    }
    this.spinnerService.show();
    this.companyService.validateCompany(data)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          if (res.data.valid) {
            if (res.data.company.active) {
              this.companyDetail = res.data.company
              this.toastr.success("Company found", 'Success', { timeOut: 4000 })
              this.getBranchesByCompanyIdForEmployeeValidation(res.data.company._id)
            } else
              this.toastr.error("Company account has been deactivated, please contact administrator", 'Error', { timeOut: 4000 })
          } else {
            this.toastr.error("Company not found, please contact administrator", 'Error', { timeOut: 4000 })
          }
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
  }

  validateNewEmployeeBranch() {
    var email = ''
    if (this.employeeFirstLogin)
      email = this.formNewEmployee.value.email
    else if (this.isGoogleLogin)
      email = this.formSocialLogin.value.email
    var data: any = {
      'company': this.companyDetail.dbName,
      'branch': this.branchDetail.prefix,
      'email': email
    }
    this.spinnerService.show();
    this.employeeService.validateBranchEmployee(data)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          if (res.data.employee !== null) {
            if (res.data.employee.active) {
              if (res.data.employee.isVerified) {
                this.toastr.error("Account already verified", 'Error', { timeOut: 4000 })
              } else {
                this.employeeDetail = res.data.employee
                if (this.employeeFirstLogin) {
                  const contactControl = this.formNewEmployee.get('contact');
                  contactControl.setValidators([Validators.required]);
                } else if (this.isGoogleLogin) {
                  const contactControl = this.formSocialLogin.get('contact');
                  contactControl.setValidators([Validators.required]);
                }
                this.showFormSection('showContact')
              }
            } else
              this.toastr.error("Account with this mail has been deactivted, please contact administrator", 'Error', { timeOut: 4000 })
          } else {
            this.toastr.error("Detail not found in this branch, please contact administrator", 'Error', { timeOut: 4000 })
          }
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
  }

  getBranchesByCompanyIdForEmployeeValidation(id: any) {
    if (id) {
      this.spinnerService.show();
      this.branchService.getBranchesByCompanyIdForEmployeeValidation(id)
        .subscribe((res: any) => {
          this.spinnerService.hide();
          if (res.success == true && res.statusCode == 200) {
            this.branches = res.data.branches;
            if (this.employeeFirstLogin) {
              const branchControl = this.formNewEmployee.get('branch');
              branchControl.setValidators([Validators.required]);
            } else if (this.isGoogleLogin) {
              const branchControl = this.formSocialLogin.get('branch');
              branchControl.setValidators([Validators.required]);
            }
            this.employeeFirstLoginButton = 'Next'
            this.showBranch = true
          }
        }, err => {
          console.log(err);
          this.spinnerService.hide();
        });
    }
  }

  sendOtp() {
    this.loaderSpinnerMessage = MessageConstants.sendingOtpLoaderMessage;
    this.spinnerService.show();
    var contact = ''
    if (this.employeeFirstLogin)
      contact = this.formNewEmployee.value.contact
    else if (this.isGoogleLogin)
      contact = this.formSocialLogin.value.contact
    var data = {
      'comp_id': this.companyDetail._id,
      'company': this.companyDetail.dbName,
      'branch': this.branchDetail.prefix,
      'type': 'employee_contact_verification',
      'contact': contact
    }
    this.otpService.send(data)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 4000 })
          if (this.employeeFirstLogin) {
            const otpControl = this.formNewEmployee.get('otp');
            otpControl.setValidators([Validators.required]);
          } else if (this.isGoogleLogin) {
            const otpControl = this.formSocialLogin.get('otp');
            otpControl.setValidators([Validators.required]);
          }
          this.showFormSection('showOtp')
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      },
        err => {
          console.log(err);
          this.spinnerService.hide();
        });
  }

  verifyOtp() {
    this.loaderSpinnerMessage = MessageConstants.verifyOtpLoaderMessage;
    this.spinnerService.show();
    var contact = ''; var otp = ''
    if (this.employeeFirstLogin) {
      contact = this.formNewEmployee.value.contact
      otp = this.formNewEmployee.value.otp
    }
    else if (this.isGoogleLogin) {
      contact = this.formSocialLogin.value.contact
      otp = this.formSocialLogin.value.otp
    }
    var data = {
      'comp_id': this.companyDetail._id,
      'company': this.companyDetail.dbName,
      'branch': this.branchDetail.prefix,
      'contact': contact,
      'otp': otp
    };
    this.otpService.verify(data)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 4000 })
          if (this.isGoogleLogin) {
            this.updateEmployeeVerificationStatus()
          } else {
            const passwordControl = this.formNewEmployee.get('password');
            const confirmPasswordControl = this.formNewEmployee.get('confirmPassword');
            passwordControl.setValidators([Validators.required]);
            confirmPasswordControl.setValidators([Validators.required]);
            this.employeeFirstLoginButton = 'Submit'
            this.showFormSection('showPassword')
          }
        } else if (res.success == false) {
          this.toastr.error((res.message ? res.message : MessageConstants.serverError), 'Error', { timeOut: 3000 })
        } else {
          this.toastr.error((res.message ? res.message : MessageConstants.serverError), 'Error', { timeOut: 4000 })
        }
      },
        err => {
          console.log(err);
          this.spinnerService.hide();
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        });
  }

  updateEmployeeVerificationStatus() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.spinnerService.show();
    var contact = ''; var email = ''
    if (this.employeeFirstLogin) {
      contact = this.formNewEmployee.value.contact
      email = this.formNewEmployee.value.email
    }
    else if (this.isGoogleLogin) {
      contact = this.formSocialLogin.value.contact
      email = this.formSocialLogin.value.email
    }
    var data = {
      'company': this.companyDetail.dbName,
      'branch': this.branchDetail.prefix,
      'contact': contact,
      'email': email,
      'isVerified': true,
    };
    this.employeeService.updateEmployeeVerificationStatus(data)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.submitNewEmployeeProfile()
        } else if (res.success == false)
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        else
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 4000 })
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
  }

  submitNewEmployeeProfile() {
    var contact = ''; var email = ''; var password = ''; var confirmPassword = ''; var provider = ''
    if (this.employeeFirstLogin) {
      contact = this.formNewEmployee.value.contact
      email = this.formNewEmployee.value.email
      provider = 'web'
      password = this.formNewEmployee.value.password
      confirmPassword = this.formNewEmployee.value.confirmPassword
    }
    else if (this.isGoogleLogin) {
      contact = this.formSocialLogin.value.contact
      email = this.formSocialLogin.value.email
      provider = 'google'
      password = this.formSocialLogin.value.password
      confirmPassword = this.formSocialLogin.value.confirmPassword
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
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.spinnerService.show();
    this.userService.registerEmployee(data)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 4000 })
          if (this.isGoogleLogin) {
            this.loginUserGoogle()
          } else {
            this.isEmployee = true
            this.showSection('employeeLogin')
          }
        } else if (res.success == false && res.statusCode == 200)
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        else
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 5000 })
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
  }

  loginUser() {
    this.spinnerService.show();
    this.authenticateService.login(this.form.value)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.authenticateService.setAccessToken(res.data.token);
          this.getUserProfile(res.data.user._id)
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
  }

  loginUserGoogle() {
    this.spinnerService.show();
    this.authenticateService.loginGoogle(this.user)
      .subscribe((res: any) => {
        this.spinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.authenticateService.setAccessToken(res.data.token);
          this.getUserProfile(res.data.user._id)
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
          // this.formSocialLogin.value.email = this.user.email
          this.formSocialLogin.patchValue({
            email: this.user.email
          })
          this.validateNewEmployeeEmail()
          this.showSection('socialFirstLogin')
          this.showFormSection('showEmail')
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      }, err => {
        console.log(err);
        this.spinnerService.hide();
      });
  }

  getUserProfile(id) {
    this.authenticateService.getUserProfile(id)
      .subscribe((res: any) => {
        this.authenticateService.checkBrowser(res);
        this.router.navigate(['/dashboard']);
      }
      )
  }

}
