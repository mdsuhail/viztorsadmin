import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { CommonService } from './_services/global/common.service';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public router: Router,
    private commonService: CommonService,
	private toastr: ToastrService,
  ) {	  
	this.createOnline$().subscribe(isOnline => !isOnline ? this.toastr.error('Please check your internet connection', 'Error', { timeOut: 4000 }) : '');
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.commonService.setTitle(
          this.commonService.Ucase(this.commonService.parentUrl())
          + ' ' +
          this.commonService.Ucase(this.commonService.childUrl()));
      }
    });
  }
  
  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

}
