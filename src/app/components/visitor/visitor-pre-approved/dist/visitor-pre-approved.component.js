"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VisitorPreApprovedComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var api_1 = require("../../../_common/constants/api");
var message_1 = require("../../../_common/constants/message");
var website_1 = require("../../../_common/constants/website");
var VisitorPreApprovedComponent = /** @class */ (function () {
    function VisitorPreApprovedComponent(router, formBuilder, SpinnerService, toastr, routeService, visitorService, faceService) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.SpinnerService = SpinnerService;
        this.toastr = toastr;
        this.routeService = routeService;
        this.visitorService = visitorService;
        this.faceService = faceService;
        this.submitted = false;
        this.websiteConstants = {};
        this.currentUser = {};
        this.currentUserRole = {};
        this.currentUserCompany = {};
        this.currentUserBranch = {};
        this.profileImagePath = '';
        this.govermentIdImagePath = '';
        this.isProfileImageDetailFound = false;
        this.faceData = {
            Face: {
                FaceId: '',
                ImageId: ''
            }
        };
        this.todayDate = new Date().toISOString().split('T')[0];
    }
    VisitorPreApprovedComponent.prototype.ngOnInit = function () {
        this.loaderSpinnerMessage = message_1.MessageConstants.loaderMessage;
        this.websiteConstants = website_1.WebsiteConstants;
        this.currentUser = JSON.parse(localStorage.getItem('user'));
        this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
        this.currentUserBranch = JSON.parse(localStorage.getItem('branch'));
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.form = this.formBuilder.group({
            name: ['', forms_1.Validators.required],
            email: ['', forms_1.Validators.required],
            contact: ['', [forms_1.Validators.required, forms_1.Validators.minLength(10)]],
            companyFrom: ['', forms_1.Validators.required],
            preApprovedDate: ['', forms_1.Validators.required],
            whomToMeet: '',
            profileImage: ['', forms_1.Validators.required],
            profileImagePath: [''],
            governmentIdUploadedImage: [''],
            governmentIdUploadedImagePath: [''],
            approvalStatus: [''],
            // message: [''],
            company: [(this.currentUserCompany ? this.currentUserCompany._id : '')],
            active: [true, [forms_1.Validators.required]]
        });
    };
    VisitorPreApprovedComponent.prototype.getVisitorProfileByContact = function (contact) {
        var _this = this;
        if (contact.length < 10)
            return;
        this.SpinnerService.show();
        this.visitorService.getProfileByContact(contact).subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                if (res.data.visitor && res.data.visitor !== null) {
                    _this.toastr.success('Detail found', 'Success', { timeOut: 3000 });
                    _this.setDetail(res.data.visitor);
                }
                else
                    _this.toastr.success('No detail found, please fill detail', 'Success', { timeOut: 3000 });
            }
        }, function (err) {
            _this.SpinnerService.hide();
            console.log(err);
        });
    };
    VisitorPreApprovedComponent.prototype.setDetail = function (data) {
        this.form.setValue({
            name: data.name,
            email: data.email,
            contact: data.contact,
            whomToMeet: '',
            companyFrom: data.companyFrom,
            preApprovedDate: '',
            // message: '',
            profileImage: 'NA',
            profileImagePath: data.profileImagePath ? data.profileImagePath : '',
            governmentIdUploadedImage: '',
            governmentIdUploadedImagePath: data.governmentIdUploadedImagePath ? data.governmentIdUploadedImagePath : '',
            approvalStatus: '',
            company: this.currentUserCompany ? this.currentUserCompany._id : '',
            active: true
        });
        this.profileImagePath = data.profileImagePath ? api_1.ApiConstants.webURL + '/' + data.profileImagePath : '';
        this.govermentIdImagePath = data.governmentIdUploadedImagePath ? api_1.ApiConstants.webURL + '/' + data.governmentIdUploadedImagePath : '';
    };
    VisitorPreApprovedComponent.prototype.onFileChange = function ($event) {
        this.readThis($event.target);
    };
    VisitorPreApprovedComponent.prototype.readThis = function (inputValue) {
        var _this = this;
        var file = inputValue.files[0];
        this.profileImagePath = '';
        this.form.value.profileImagePath = '';
        if (file && file !== undefined) {
            var myReader = new FileReader();
            myReader.onloadend = function (e) {
                var image = myReader.result;
                _this.form.patchValue({
                    profileImage: image
                });
                if (_this.form.value.profileImage)
                    _this.checkFaceData();
            };
            myReader.readAsDataURL(file);
        }
    };
    VisitorPreApprovedComponent.prototype.checkFaceData = function () {
        if (this.currentUserBranch && this.currentUserBranch.isTouchlessData)
            this.recognizeFace();
    };
    VisitorPreApprovedComponent.prototype.recognizeFace = function () {
        var _this = this;
        var imageBase64 = this.form.value.profileImage ? this.form.value.profileImage : '';
        var image = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        var data = {
            "collection_name": this.currentUserCompany ? this.currentUserCompany.collectionName : api_1.ApiConstants.defaultCollectionName,
            "image": image
        };
        this.SpinnerService.show();
        this.recognizeFaceService = this.faceService.recognize(data)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200 && res.data !== null) {
                _this.faceData = res.data;
                _this.getVisitorByFace();
            }
            else {
                _this.addFace();
            }
        }, function (err) {
            _this.SpinnerService.hide();
            console.log(err);
        });
    };
    VisitorPreApprovedComponent.prototype.getVisitorByFace = function () {
        var _this = this;
        this.visitorService.getVisitorByFace(this.faceData).subscribe(function (res) {
            if (res.success == true && res.statusCode == 200 && res.data !== null)
                _this.isProfileImageDetailFound = true;
            else
                _this.isProfileImageDetailFound = false;
        }, function (err) {
            console.log(err);
        });
    };
    VisitorPreApprovedComponent.prototype.addFace = function () {
        var _this = this;
        var imageBase64 = this.form.value.profileImage ? this.form.value.profileImage : '';
        var image = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
        var data = {
            "collection_name": this.currentUserCompany ? this.currentUserCompany.collectionName : api_1.ApiConstants.defaultCollectionName,
            "image": image
        };
        this.SpinnerService.show();
        this.faceService.add(data)
            .subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200 && res.data !== null) {
                _this.faceData = res.data;
            }
            else {
                _this.toastr.error(message_1.MessageConstants.noFaceError, 'Error', { timeOut: 5000 });
            }
        }, function (err) {
            _this.SpinnerService.hide();
            console.log(err);
        });
    };
    Object.defineProperty(VisitorPreApprovedComponent.prototype, "f", {
        // convenience getter for easy access to form fields
        get: function () { return this.form.controls; },
        enumerable: false,
        configurable: true
    });
    VisitorPreApprovedComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        this.form.value.faceData = this.faceData;
        this.form.value.isPreApproved = true;
        this.form.value.approvalStatus = 'approved';
        this.form.value.type = 'create';
        this.form.value.isProfileImageDetailFound = this.isProfileImageDetailFound;
        this.form.value.whomToMeet = this.currentUser._id;
        if (this.form.value.profileImage && this.form.value.profileImage !== 'NA') {
            var imageBase64 = this.form.value.profileImage;
            this.form.value.profileImage = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
            this.form.value.profileImagePath = '';
        }
        this.SpinnerService.show();
        this.visitorService.preApproved(this.form.value).subscribe(function (res) {
            _this.SpinnerService.hide();
            if (res.success == true && res.statusCode == 200) {
                _this.toastr.success(res.message, 'Success', { timeOut: 3000 });
                _this.router.navigate(['/visitor/list']);
            }
        }, function (err) {
            _this.SpinnerService.hide();
            console.log(err);
        });
    };
    VisitorPreApprovedComponent.prototype.onReset = function () {
        this.submitted = false;
        this.form.reset();
    };
    VisitorPreApprovedComponent.prototype.backClicked = function () {
        // this.departmentService.back();
    };
    VisitorPreApprovedComponent = __decorate([
        core_1.Component({
            selector: 'app-visitor-pre-approved',
            templateUrl: './visitor-pre-approved.component.html',
            styleUrls: ['./visitor-pre-approved.component.scss']
        })
    ], VisitorPreApprovedComponent);
    return VisitorPreApprovedComponent;
}());
exports.VisitorPreApprovedComponent = VisitorPreApprovedComponent;
