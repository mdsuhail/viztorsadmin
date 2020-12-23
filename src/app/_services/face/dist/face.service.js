"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FaceService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var api_1 = require("../../_common/constants/api");
var FaceService = /** @class */ (function () {
    function FaceService(http, _location) {
        this.http = http;
        this._location = _location;
    }
    FaceService.prototype.recognize = function (data) {
        var apiUrl = api_1.ApiConstants.faceURL + "/" + api_1.ApiConstants.faceRecognize;
        return this.http.post(apiUrl, data).pipe(operators_1.timeout(30000), operators_1.catchError(function (err) {
            return rxjs_1.throwError("Error in Response");
        }));
    };
    FaceService.prototype.add = function (data) {
        var apiUrl = api_1.ApiConstants.faceURL + "/" + api_1.ApiConstants.faceAdd;
        return this.http.post(apiUrl, data).pipe(operators_1.timeout(30000), operators_1.catchError(function (err) {
            return rxjs_1.throwError("Error in Response");
        }));
    };
    // Error
    FaceService.prototype.handleError = function (error) {
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
    FaceService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], FaceService);
    return FaceService;
}());
exports.FaceService = FaceService;
