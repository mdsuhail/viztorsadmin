import { Component, OnInit } from '@angular/core';
import { WebsiteConstants } from '../_common/constants/website';
import { Location } from '@angular/common';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  websiteConstants: any = {};

  constructor(
    public _location: Location,
  ) { }

  ngOnInit() {
    this.websiteConstants = WebsiteConstants;
  }
}
