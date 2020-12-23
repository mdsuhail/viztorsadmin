import { Component, OnInit, ElementRef } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
//import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../../auth/auth.service';
import { RouteConstants } from '../../../_common/constants/route';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    isDesktopDevice: boolean = false;
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

    constructor(
        location: Location,
        private element: ElementRef,
        private router: Router,
        private authService: AuthenticateService,
        private deviceService: DeviceDetectorService
    ) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.isDesktopDevice = this.deviceService.isDesktop();
        this.currentUserRole = JSON.parse(localStorage.getItem('role'));
        this.currentUserResources = JSON.parse(localStorage.getItem('resources'));
        this.currentUserResources[this.currentUserResources.length] = this.newFeatures;
        this.listTitles = this.currentUserResources.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
        if (this.currentUserRole.name == 'superadmin')
            this.router.navigate(['/company/list'])
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }
        if (titlee.indexOf('Android_asset') > 0)
            titlee = titlee.split('/')[3];
        else
            titlee = titlee.split('/')[1];
        if (titlee && RouteConstants[titlee])
            return RouteConstants[titlee];
        return 'Dashboard';
    }

    logout() {
        this.authService.logout();
    }

}
