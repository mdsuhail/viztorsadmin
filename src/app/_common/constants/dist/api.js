"use strict";
exports.__esModule = true;
exports.ApiConstants = void 0;
var ApiConstants = /** @class */ (function () {
    function ApiConstants() {
    }
    ApiConstants.siteTitle = "Viztors";
    //for local
    ApiConstants.webURL = "http://127.0.0.1:4000";
    ApiConstants.baseURL = "http://127.0.0.1:4000/api";
    ApiConstants.apiURL = "http://127.0.0.1:4000/api"; //dont use this
    ApiConstants.faceURL = "http://127.0.0.1:4000/api/v1";
    ApiConstants.checkinURL = "http://localhost:4300";
    //for production
    // public static webURL: string = "https://app.viztors.com/";
    // public static baseURL: string = "https://app.viztors.com/api";
    // public static apiURL: string = "https://app.viztors.com/api"; //dont use this
    // public static faceURL: string = "https://app.viztors.com";
    // public static checkinURL: string = "https://app.viztors.com/checkin/";
    //api version
    ApiConstants.apiVersion = "v1";
    //default collection name
    ApiConstants.defaultCollectionName = "technexa";
    //roles
    ApiConstants.roles = "roles";
    //roles
    ApiConstants.dashboard = "dashboard";
    ApiConstants.signinChart = "dashboard/graph/signin";
    ApiConstants.signoutChart = "dashboard/graph/signout";
    //users
    ApiConstants.userLogin = "authentication/login";
    ApiConstants.userLoginGoogle = "authentication/login/google";
    ApiConstants.userRegister = "users/register";
    ApiConstants.userRegisterEmployee = "users/register/employee";
    ApiConstants.userProfile = "users/profile";
    ApiConstants.userDelete = "users/delete";
    ApiConstants.users = "users";
    //companies
    ApiConstants.companies = "companies";
    ApiConstants.companyProfile = "companies/profile";
    ApiConstants.companyDelete = "companies/delete";
    ApiConstants.companyValidate = "companies/validate";
    //branches
    ApiConstants.branches = "branches";
    ApiConstants.branchProfile = "branches/profile";
    ApiConstants.branchDelete = "branches/delete";
    //departments
    ApiConstants.departments = "departments";
    ApiConstants.departmentProfile = "departments/profile";
    ApiConstants.departmentDelete = "departments/delete";
    //employees
    ApiConstants.employees = "employees";
    ApiConstants.employeesImport = "employees/import";
    ApiConstants.employeeProfile = "employees/profile";
    ApiConstants.employeeDelete = "employees/delete";
    ApiConstants.employeeNewValidateEmail = "employees/new/validate";
    //visitors
    ApiConstants.visitors = "visitors";
    ApiConstants.visitorProfile = "visitors/profile";
    ApiConstants.visitorProfileByContact = "visitors/detail";
    ApiConstants.visitorDelete = "visitors/delete";
    ApiConstants.visitorSignOut = "visitors/signout";
    ApiConstants.visitorDetailByFaceData = "visitors/face";
    ApiConstants.visitorsPreApproved = "visitors/preapproved";
    //visitor categories
    ApiConstants.visitorCategories = "visitorcategories";
    ApiConstants.visitorCategory = "visitorcategories/profile";
    ApiConstants.visitorCategoryDelete = "visitorcategories/delete";
    //otp
    ApiConstants.otpSend = "otp/send";
    ApiConstants.otpSendForEmployeeValidation = "otp/send/employee/validation";
    ApiConstants.otpVerify = "otp/verify";
    ApiConstants.otpVerifyForEmployeeValidation = "otp/verify/employee/validation";
    //face
    ApiConstants.faceAdd = "face/add";
    ApiConstants.faceRecognize = "face/recognize";
    return ApiConstants;
}());
exports.ApiConstants = ApiConstants;
