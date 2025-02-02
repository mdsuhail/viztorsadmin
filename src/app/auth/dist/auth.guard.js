"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthGuard = void 0;
var core_1 = require("@angular/core");
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router, toastr, location) {
        this.authService = authService;
        this.router = router;
        this.toastr = toastr;
        this.location = location;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var access_token = route.queryParams.access_token;
        if (access_token) {
            var local_access_token = localStorage.getItem('access_token');
            if (local_access_token !== '' || local_access_token !== undefined || local_access_token !== null)
                localStorage.setItem('access_token', access_token);
        }
        if (this.authService.isLoggedIn !== true) {
            // this.toastr.error(MessageConstants.mustLogin, 'Error', { timeOut: 4000 })
            this.router.navigate(['login']);
            return false;
        }
        return true;
    };
    AuthGuard = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AuthGuard);
    return AuthGuard;
}());
exports.AuthGuard = AuthGuard;
