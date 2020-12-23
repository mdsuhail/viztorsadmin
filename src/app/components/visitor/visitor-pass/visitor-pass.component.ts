import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { VisitorService } from './../../../_services/visitor/visitor.service';
import { MessageConstants } from '../../../_common/constants/message';

@Component({
  selector: 'app-visitor-pass',
  templateUrl: './visitor-pass.component.html',
  styleUrls: ['./visitor-pass.component.scss']
})
export class VisitorPassComponent implements OnInit {

  data: any = {};
  params: any = {};
  loaderSpinnerMessage: String;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public SpinnerService: NgxSpinnerService,
    private visitorService: VisitorService,
  ) { }

  ngOnInit() {
    this.loaderSpinnerMessage = MessageConstants.loaderMessage;
    this.route.queryParams.subscribe(params => {
      this.params = {
        branch: params['branch'] && params['branch'] !== null ? params['branch'] : '',
        prefix: params['prefix'] && params['prefix'] !== null ? params['prefix'] : '',
      }
    });
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id != undefined)
        this.getVisitor(id, this.params);
    });
  }

  // Visitor detail
  getVisitor(id: any, params?: any) {
    this.SpinnerService.show();
    this.visitorService.getVisitor(id, params)
      .subscribe((res: any) => {
        this.SpinnerService.hide();
        if (res.success == true && res.statusCode == 200) {
          this.data = res.data.visitor;
        }
      }, err => {
        console.log(err);
        this.SpinnerService.hide();
      });
  }

  onBtnPrintClick(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  closeWindow() {
    window.close();
  }

}
