import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ApiConstants } from '../_common/constants/api';
import { MessageConstants } from '../_common/constants/message';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    console.log('user profile');
  }

}
