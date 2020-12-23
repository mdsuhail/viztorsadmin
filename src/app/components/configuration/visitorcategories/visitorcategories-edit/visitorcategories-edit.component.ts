import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageConstants } from '../../../../_common/constants/message';
import { WebsiteConstants } from '../../../../_common/constants/website';
import { RouteService } from './../../../../_services/route/route.service';
import { CommonService } from './../../../../_services/global/common.service';
import { VisitorcategoriesService } from './../../../../_services/visitorcategories/visitorcategories.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-visitorcategories-edit',
  templateUrl: './visitorcategories-edit.component.html',
  styleUrls: ['./visitorcategories-edit.component.scss']
})
export class VisitorcategoriesEditComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  loaderSpinnerMessage: String;
  websiteConstants: any = {};
  // currentUserRole: any = {};
  // currentUserCompany: any = {};
  data: any = {};

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private visitorcategoriesService: VisitorcategoriesService,
    private commonService: CommonService,
    private routeService: RouteService,
  ) {
  }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.websiteConstants = WebsiteConstants;
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getVisitorCategory(id);
    });
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      backgroundImagePath: [''],
      image: [''],
      active: [true, [Validators.required]],
    });
  }

  // Deapartment profile
  getVisitorCategory(id: any) {
    this.visitorcategoriesService.getVisitorCategory(id)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.data = res.data.visitorCategory;
          this.setDetail(this.data);
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  setDetail(data: any) {
    this.form.patchValue({
      name: data.name,
      backgroundImagePath: data.backgroundImagePath,
      active: data.active
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
    let id = this.data._id;
    this.visitorcategoriesService.updateVisitorCategory(id, this.form.value)
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
