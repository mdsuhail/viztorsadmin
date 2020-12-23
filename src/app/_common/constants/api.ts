export class ApiConstants {
    public static siteTitle: string = "Viztors";

    //for local
    public static webURL: string = "http://127.0.0.1:4000";
    public static baseURL: string = "http://127.0.0.1:4000/api";
    public static apiURL: string = "http://127.0.0.1:4000/api"; //dont use this
    public static faceURL: string = "http://127.0.0.1:4000/api/v1";
    public static checkinURL: string = "http://localhost:4300";

    //Google client id and secret for local 
    public static googleAuthClientId: string = "852045609580-pnuu6k8mc2gj28pvm8drften3budokm9.apps.googleusercontent.com";
    public static googleAuthClientSecret: string = "ArgACnwwg-QMVnlEVvKC0_G7";

    //for production
    // public static webURL: string = "https://app.viztors.com/";
    // public static baseURL: string = "https://app.viztors.com/api";
    // public static apiURL: string = "https://app.viztors.com/api"; //dont use this
    // public static faceURL: string = "https://app.viztors.com";
    // public static checkinURL: string = "https://app.viztors.com/checkin/";

    //Google client id and secret for production
    // public static googleAuthClientId: string = "208288282738-ghij9a4hoa5oiuncifvti47en3alt7cq.apps.googleusercontent.com";
    // public static googleAuthClientSecret: string = "w3SmwOGvxeE9RRjBqh5jCrGZ";

    //api version
    public static apiVersion: string = "v1";

    //default collection name
    public static defaultCollectionName: string = "technexa";

    //roles
    public static roles: string = "roles";

    //roles
    public static dashboard: string = "dashboard";
    public static signinChart: string = "dashboard/graph/signin";
    public static signoutChart: string = "dashboard/graph/signout";

    //users
    public static userLogin: string = "authentication/login";
    public static userLoginGoogle: string = "authentication/login/google";
    public static userRegister: string = "users/register";
    public static userRegisterEmployee: string = "users/register/employee";
    public static userProfile: string = "users/profile";
    public static userProfileByEmail: string = "users/profile/email";
    public static userDelete: string = "users/delete";
    public static users: string = "users";

    //companies
    public static companies: string = "companies";
    public static companyProfile: string = "companies/profile";
    public static companyDelete: string = "companies/delete";
    public static companyValidate: string = "companies/validate";

    //branches
    public static branches: string = "branches";
    public static branchProfile: string = "branches/profile";
    public static branchDelete: string = "branches/delete";

    //departments
    public static departments: string = "departments";
    public static departmentProfile: string = "departments/profile";
    public static departmentDelete: string = "departments/delete";

    //employees
    public static employees: string = "employees";
    public static employeesImport: string = "employees/import";
    public static employeeProfile: string = "employees/profile";
    public static employeeProfileByEmail: string = "employees/profile/email";
    public static employeeDelete: string = "employees/delete";
    public static employeeNewValidateEmail: string = "employees/new/validate";

    //visitors
    public static visitors: string = "visitors";
    public static visitorProfile: string = "visitors/profile";
    public static visitorProfileByContact: string = "visitors/detail";
    public static visitorDelete: string = "visitors/delete";
    public static visitorSignOut: string = "visitors/signout";
    public static visitorDetailByFaceData: string = "visitors/face";
    public static visitorsPreApproved: string = "visitors/preapproved";

    //visitor categories
    public static visitorCategories: string = "visitorcategories";
    public static visitorCategory: string = "visitorcategories/profile";
    public static visitorCategoryDelete: string = "visitorcategories/delete";

    //otp
    public static otpSend: string = "otp/send";
    public static otpSendForEmployeeValidation: string = "otp/send/employee/validation";
    public static otpVerify: string = "otp/verify";
    public static otpVerifyForEmployeeValidation: string = "otp/verify/employee/validation";

    //face
    public static faceAdd: string = "face/add";
    public static faceRecognize: string = "face/recognize";

}