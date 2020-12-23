import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitorService } from './../../../_services/visitor/visitor.service';
import { EmployeeService } from './../../../_services/employee/employee.service';
import { FaceService } from './../../../_services/face/face.service';
import { ApiConstants } from '../../../_common/constants/api';
import { MessageConstants } from '../../../_common/constants/message';
import { WebsiteConstants } from '../../../_common/constants/website';
import { RouteService } from './../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';

@Component({
  selector: 'app-visitor-pre-approved',
  templateUrl: './visitor-pre-approved.component.html',
  styleUrls: ['./visitor-pre-approved.component.scss']
})
export class VisitorPreApprovedComponent implements OnInit {

  public webcamImage: WebcamImage = null;
  form: FormGroup;
  submitted = false;
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
  currentUser: any = {};
  currentUserRole: any = {};
  currentUserCompany: any = {};
  currentUserBranch: any = {};
  profileImagePath = ''
  govermentIdImagePath = ''
  recognizeFaceService: any
  isProfileImageDetailFound = false
  employeeDetail: any;
  department: ''
  contactVal: ''
  faceData: any = {
    Face: {
      FaceId: '',
      ImageId: ''
    }
  }
  todayDate = new Date().toISOString().split('T')[0];

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private routeService: RouteService,
    private visitorService: VisitorService,
    private faceService: FaceService,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.websiteConstants = WebsiteConstants;
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
    this.currentUserBranch = JSON.parse(localStorage.getItem('branch'));
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.getEmployeeByEmail()
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      contact: ['', [Validators.required, Validators.minLength(10)]],
      companyFrom: ['', Validators.required],
      preApprovedDate: ['', Validators.required],
      whomToMeet: '',
      department: '',
      profileImage: ['', Validators.required],
      profileImagePath: [''],
      governmentIdUploadedImage: [''],
      governmentIdUploadedImagePath: [''],
      approvalStatus: [''],
      // message: [''],
      company: [(this.currentUserCompany ? this.currentUserCompany._id : '')],
      active: [true, [Validators.required]],
    });
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }

  getVisitorProfileByContact(contact, isClicked = false) {
    if (contact.length < 10) {
      if (isClicked)
        this.toastr.error('Please enter 10 digit number', 'Error', { timeOut: 3000 })
      return
    }
    this.SpinnerService.show()
    this.visitorService.getProfileByContact(contact).subscribe((res: any) => {
      this.SpinnerService.hide()
      if (res.success == true && res.statusCode == 200) {
        if (res.data.visitor && res.data.visitor !== null) {
          this.toastr.success('Detail found', 'Success', { timeOut: 3000 })
          this.setDetail(res.data.visitor);
        } else {
          this.contactVal = contact
          this.form.reset()
          this.form.patchValue({
            contact: this.contactVal
          })
          this.toastr.success('No detail found, please fill detail', 'Success', { timeOut: 3000 })
        }
      }
    }, err => {
      this.SpinnerService.hide()
      console.log(err);
    });
  }

  setDetail(data: any) {
    this.form.setValue({
      name: data.name,
      email: data.email,
      contact: data.contact,
      whomToMeet: '',
      department: '',
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
    this.profileImagePath = data.profileImagePath ? ApiConstants.webURL + '/' + data.profileImagePath : '';
    this.govermentIdImagePath = data.governmentIdUploadedImagePath ? ApiConstants.webURL + '/' + data.governmentIdUploadedImagePath : '';
  }

  onFileChange($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    this.profileImagePath = ''
    this.form.value.profileImagePath = ''
    if (file && file !== undefined) {
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        var image = myReader.result;
        this.form.patchValue({
          profileImage: image
        });
        if (this.form.value.profileImage)
          this.checkFaceData()
      }
      myReader.readAsDataURL(file);
    }
  }

  checkFaceData() {
    if (this.currentUserBranch && this.currentUserBranch.isTouchlessData)
      this.recognizeFace()
  }

  recognizeFace() {
    let imageBase64 = this.form.value.profileImage ? this.form.value.profileImage : ''
    let image = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    var data = {
      "collection_name": this.currentUserCompany ? this.currentUserCompany.collectionName : ApiConstants.defaultCollectionName,
      "image": image
    }
    this.SpinnerService.show()
    this.recognizeFaceService = this.faceService.recognize(data)
      .subscribe((res: any) => {
        this.SpinnerService.hide()
        if (res.success == true && res.statusCode == 200 && res.data !== null) {
          this.faceData = res.data;
          this.getVisitorByFace();
        } else {
          this.addFace()
        }
      }, err => {
        this.SpinnerService.hide()
        console.log(err);
      });
  }

  getVisitorByFace() {
    this.visitorService.getVisitorByFace(this.faceData).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200 && res.data !== null)
        this.isProfileImageDetailFound = true
      else
        this.isProfileImageDetailFound = false
    }, err => {
      console.log(err);
    });
  }

  getEmployeeByEmail() {
    let email = this.currentUser ? this.currentUser.email : ''
    this.employeeService.getEmployeeByEmail(email).subscribe((res: any) => {
      if (res.success == true && res.statusCode == 200) {
        this.employeeDetail = res.data.employee;
        this.department = this.employeeDetail.department._id
      }
    }, err => {
      console.log(err);
    });
  }

  addFace() {
    let imageBase64 = this.form.value.profileImage ? this.form.value.profileImage : ''
    let image = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    var data = {
      "collection_name": this.currentUserCompany ? this.currentUserCompany.collectionName : ApiConstants.defaultCollectionName,
      "image": image
    }
    this.SpinnerService.show()
    this.faceService.add(data)
      .subscribe((res: any) => {
        this.SpinnerService.hide()
        if (res.success == true && res.statusCode == 200 && res.data !== null) {
          this.faceData = res.data;
        } else {
          this.toastr.error(MessageConstants.noFaceError, 'Error', { timeOut: 5000 })
        }
      }, err => {
        this.SpinnerService.hide()
        console.log(err);
      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.form.value.faceData = this.faceData
    this.form.value.isPreApproved = true
    this.form.value.approvalStatus = 'approved'
    this.form.value.type = 'create'
    this.form.value.isProfileImageDetailFound = this.isProfileImageDetailFound
    this.form.value.whomToMeet = this.currentUser._id
    this.form.value.department = this.department
    if (this.form.value.profileImage && this.form.value.profileImage !== 'NA') {
      var imageBase64 = this.form.value.profileImage
      this.form.value.profileImage = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      this.form.value.profileImagePath = '';
    }
    this.SpinnerService.show();
    this.visitorService.preApproved(this.form.value).subscribe((res: any) => {
      this.SpinnerService.hide();
      if (res.success == true && res.statusCode == 200) {
        this.toastr.success(res.message, 'Success', { timeOut: 3000 })
        this.router.navigate(['/visitor/list']);
      }
    }, err => {
      this.SpinnerService.hide();
      console.log(err);
    });

  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }

  backClicked() {
    // this.departmentService.back();
  }

}
