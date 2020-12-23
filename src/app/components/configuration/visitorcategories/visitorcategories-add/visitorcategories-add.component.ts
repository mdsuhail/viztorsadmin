import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from './../../../../_services/global/common.service';
import { VisitorcategoriesService } from './../../../../_services/visitorcategories/visitorcategories.service';
import { MessageConstants } from '../../../../_common/constants/message';
import { WebsiteConstants } from '../../../../_common/constants/website';
import { RouteService } from './../../../../_services/route/route.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-visitorcategories-add',
  templateUrl: './visitorcategories-add.component.html',
  styleUrls: ['./visitorcategories-add.component.scss']
})
export class VisitorcategoriesAddComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
  currentUserRole: any = {};
  currentUserCompany: any = {};

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    public toastr: ToastrService,
    public visitorcategoriesService: VisitorcategoriesService,
    public commonService: CommonService
  ) { }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.websiteConstants = WebsiteConstants;
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      image: [''],
      //company: [(this.currentUserCompany ? this.currentUserCompany._id : '')],
      //default: [(this.currentUserRole.name == 'superadmin' ? true : false)],
      active: [true, [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onFileChange($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    if (file && file !== undefined) {
      var myReader: FileReader = new FileReader();
      myReader.onloadend = (e) => {
        var image = myReader.result;
        this.form.patchValue({
          image: image
        });
      }
      myReader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.SpinnerService.show();
    this.visitorcategoriesService.addVisitorCategory(this.form.value)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.toastr.success(res.message, 'Success', { timeOut: 3000 })
          this.router.navigate(['/visitorcategories/list']);
        } else if (res.success == false) {
          this.toastr.error(res.message, 'Error', { timeOut: 4000 })
        } else {
          this.toastr.error(MessageConstants.serverError, 'Error', { timeOut: 6000 })
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }

  backClicked() {
    this.commonService.back();
  }

}
