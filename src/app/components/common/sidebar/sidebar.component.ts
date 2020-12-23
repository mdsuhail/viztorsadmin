import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { AuthenticateService } from '../../../auth/auth.service';
import { LocalStorageService } from '../../../_services/localstorage/localstorage.service';
import { ApiConstants } from '../../../_common/constants/api';
declare const jQuery: any;
declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
// export const ROUTES = [
//   { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
//   // { path: '/profile', title: 'Profile', icon: 'person', class: '' },
//   { path: '/visitor/list', title: 'Visitors', icon: 'person', class: '' },
//   { path: '/company/list', title: 'Companies', icon: 'apartment', class: '' },
//   { path: '/department/list', title: 'Departments', icon: 'apartment', class: '' },
//   { path: '/employee/list', title: 'Employees', icon: 'person', class: '' },
//   { path: '/user/list', title: 'Users', icon: 'person', class: '' },
//   // { path: '/table-list', title: 'Table List', icon: 'content_paste', class: '' },
//   // { path: '/typography', title: 'Typography', icon: 'library_books', class: '' },
//   // { path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '' },
//   // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
//   //{ path: '/notifications', title: 'Notifications', icon: 'notifications', class: '' },
//   //{ path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
// ];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  currentUserCompany: any = {};
  currentUserRole: any = {};
  currentUserResources: any = {};

  newFeatures = {
    "name": "features",
    "displayName": "New Features",
    "description": "This is new feature resource",
    "path": "/features",
    "icon": "new_releases",
    "class": "",
    "default": true,
    "active": true,
    "position": 7,
    "_id": "5e7df162bb99d22fc0a3c18c",
    "createdAt": "2020-03-27T12:28:18.747Z"
  }


  // configMenu = {
  //   "name": "configuration",
  //   "displayName": "Configuration",
  //   "description": "This is config resource",
  //   "path": "/",
  //   "icon": "build",
  //   "class": "",
  //   "default": true,
  //   "active": true,
  //   "position": 8,
  //   "_id": "5e7df162bb99876fc0a3c18c",
  //   "createdAt": "2020-03-27T12:28:18.747Z",
  //   "submenus": [
  //     {
  //       "name": "visitorcategories",
  //       "displayName": "Visitor Categories",
  //       "description": "This is visitor categories resource",
  //       "path": "/visitorcategories/list",
  //       "icon": "",
  //       "class": "",
  //       "default": true,
  //       "active": true,
  //       "position": 1,
  //       "_id": "5e7df162bb99d22fc0a3u87c",
  //       "createdAt": "2020-03-27T12:28:18.747Z"
  //     }
  //   ]
  // };


  constructor(
    private router: Router,
    private authService: AuthenticateService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
    this.currentUserCompany.logo = ApiConstants.webURL + '/' + this.currentUserCompany.logo;
    this.currentUserRole = JSON.parse(localStorage.getItem('role'));
    this.currentUserResources = JSON.parse(localStorage.getItem('resources'));
    this.currentUserResources[this.currentUserResources.length] = this.newFeatures;
    // if (this.currentUserRole.name == 'branchadmin')
    //   this.currentUserResources[this.currentUserResources.length] = this.configMenu;


    //this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.menuItems = this.currentUserResources.filter(menuItem => menuItem);

    if (this.currentUserRole.name == 'superadmin')
      this.router.navigate(['/company/list']);

    // jQuery.fn.liScroll = function (settings) {
    //   settings = jQuery.extend({
    //     travelocity: 0.02
    //   }, settings);
    //   return this.each(function () {
    //     var $strip = jQuery(this);
    //     $strip.addClass("newsticker")
    //     var stripHeight = 1;
    //     $strip.find("li").each(function (i) {
    //       stripHeight += jQuery(this, i).outerHeight(true); // thanks to Michael Haszprunar and Fabien Volpi
    //     });
    //     var $mask = $strip.wrap("<div class='mask'></div>");
    //     var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");
    //     var containerHeight = $strip.parent().parent().height();	//a.k.a. 'mask' width 	
    //     $strip.height(stripHeight);
    //     var totalTravel = stripHeight;
    //     var defTiming = totalTravel / settings.travelocity + 2;	// thanks to Scott Waye
    //     function scrollnews(spazio, tempo) {
    //       $strip.animate({ top: '-=' + spazio }, tempo, "linear", function () { $strip.css("top", containerHeight); scrollnews(totalTravel, defTiming); });
    //     }
    //     scrollnews(totalTravel, defTiming);
    //     $strip.hover(function () {
    //       jQuery(this).stop();
    //     },
    //       function () {
    //         var offset = jQuery(this).offset();
    //         var residualSpace = offset.top + stripHeight;
    //         var residualTime = residualSpace / settings.travelocity;
    //         scrollnews(residualSpace, residualTime);
    //       });
    //   });
    // };
    // $(function () {
    //   $("ul#ticker01").liScroll();
    // });
  }

  logout() {
    this.authService.logout();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };
}
