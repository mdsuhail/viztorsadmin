"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = exports.provideConfig = void 0;
var animations_1 = require("@angular/platform-browser/animations");
var common_1 = require("@angular/common");
var ngx_device_detector_1 = require("ngx-device-detector");
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var authconfig_interceptor_1 = require("./authconfig.interceptor");
var router_1 = require("@angular/router");
var app_routing_1 = require("./app.routing");
var components_module_1 = require("./components/components.module");
var app_component_1 = require("./app.component");
var auth_guard_1 = require("./auth/auth.guard");
var auth_service_1 = require("./auth/auth.service");
var app_material_module_1 = require("./app-material/app-material.module");
var ngx_toastr_1 = require("ngx-toastr");
var ngx_spinner_1 = require("ngx-spinner");
var angularx_social_login_1 = require("angularx-social-login");
var config = new angularx_social_login_1.AuthServiceConfig([
    {
        id: angularx_social_login_1.GoogleLoginProvider.PROVIDER_ID,
        provider: new angularx_social_login_1.GoogleLoginProvider("852045609580-pnuu6k8mc2gj28pvm8drften3budokm9.apps.googleusercontent.com")
    }
]);
function provideConfig() {
    return config;
}
exports.provideConfig = provideConfig;
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';
// import { TableListComponent } from './table-list/table-list.component';
// import { TypographyComponent } from './typography/typography.component';
// import { IconsComponent } from './icons/icons.component';
// import { MapsComponent } from './maps/maps.component';
// import { NotificationsComponent } from './notifications/notifications.component';
// import { UpgradeComponent } from './upgrade/upgrade.component';
var core_2 = require("@agm/core");
var admin_layout_component_1 = require("./layouts/admin-layout/admin-layout.component");
var login_component_1 = require("./login/login.component");
//import { FeaturesComponent } from './features/features.component';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                ngx_toastr_1.ToastrModule.forRoot(),
                app_material_module_1.AppMaterialModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                http_1.HttpClientModule,
                components_module_1.ComponentsModule,
                router_1.RouterModule,
                app_routing_1.AppRoutingModule,
                ngx_spinner_1.NgxSpinnerModule,
                angularx_social_login_1.SocialLoginModule,
                //NgxChartsModule,
                ngx_device_detector_1.DeviceDetectorModule.forRoot(),
                core_2.AgmCoreModule.forRoot({
                    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
                })
            ],
            declarations: [
                app_component_1.AppComponent,
                login_component_1.LoginComponent,
                admin_layout_component_1.AdminLayoutComponent
                //FeaturesComponent
            ],
            providers: [
                auth_service_1.AuthenticateService,
                auth_guard_1.AuthGuard,
                { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy },
                {
                    provide: http_1.HTTP_INTERCEPTORS,
                    useClass: authconfig_interceptor_1.AuthInterceptor,
                    multi: true
                },
                {
                    provide: angularx_social_login_1.AuthServiceConfig,
                    useFactory: provideConfig
                }
            ],
            bootstrap: [app_component_1.AppComponent],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
