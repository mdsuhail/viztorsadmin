"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SidebarComponent = void 0;
var core_1 = require("@angular/core");
var api_1 = require("../../../_common/constants/api");
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
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(router, authService, localStorageService) {
        this.router = router;
        this.authService = authService;
        this.localStorageService = localStorageService;
        this.currentUserCompany = {};
        this.currentUserRole = {};
        this.currentUserResources = {};
        this.newFeatures = {
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
        };
        this.configMenu = {
            "name": "configuration",
            "displayName": "Configuration",
            "description": "This is config resource",
            "path": "/",
            "icon": "build",
            "class": "",
            "default": true,
            "active": true,
            "position": 8,
            "_id": "5e7df162bb99876fc0a3c18c",
            "createdAt": "2020-03-27T12:28:18.747Z",
            "submenus": [
                {
                    "name": "visitorcategories",
                    "displayName": "Visitor Categories",
                    "description": "This is visitor categories resource",
                    "path": "/visitorcategories/list",
                    "icon": "",
                    "class": "",
                    "default": true,
                    "active": true,
                    "position": 1,
                    "_id": "5e7df162bb99d22fc0a3u87c",
                    "createdAt": "2020-03-27T12:28:18.747Z"
                }
            ]
        };
    }
    SidebarComponent.prototype.ngOnInit = function () {
        this.currentUserCompany = JSON.parse(localStorage.getItem('company'));
        this.currentUserCompany.logo = api_1.ApiConstants.webURL + '/' + this.currentUserCompany.logo;
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.currentUserResources = JSON.parse(localStorage.getItem('resources'));
        this.currentUserResources[this.currentUserResources.length] = this.newFeatures;
        if (this.currentUserRole.name == 'branchadmin')
            this.currentUserResources[this.currentUserResources.length] = this.configMenu;
        //this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.menuItems = this.currentUserResources.filter(function (menuItem) { return menuItem; });
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
    };
    SidebarComponent.prototype.logout = function () {
        this.authService.logout();
    };
    SidebarComponent.prototype.isMobileMenu = function () {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    ;
    SidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.css']
        })
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
