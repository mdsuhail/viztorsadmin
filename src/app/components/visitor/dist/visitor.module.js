"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VisitorModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var angular_datatables_1 = require("angular-datatables");
var visitor_component_1 = require("./visitor/visitor.component");
var visitor_list_component_1 = require("./visitor-list/visitor-list.component");
var visitor_add_component_1 = require("./visitor-add/visitor-add.component");
var visitor_edit_component_1 = require("./visitor-edit/visitor-edit.component");
var visitor_routing_1 = require("./visitor.routing");
var application_pipe_module_1 = require("../../_common/application-pipe/application-pipe.module");
var ngx_spinner_1 = require("ngx-spinner");
var visitor_detail_component_1 = require("./visitor-detail/visitor-detail.component");
var visitor_pass_component_1 = require("./visitor-pass/visitor-pass.component");
var visitor_list_dashboard_component_1 = require("./visitor-list-dashboard/visitor-list-dashboard.component");
var visitor_pre_approved_component_1 = require("./visitor-pre-approved/visitor-pre-approved.component");
var VisitorModule = /** @class */ (function () {
    function VisitorModule() {
    }
    VisitorModule = __decorate([
        core_1.NgModule({
            declarations: [
                visitor_component_1.VisitorComponent,
                visitor_list_component_1.VisitorListComponent,
                visitor_add_component_1.VisitorAddComponent,
                visitor_edit_component_1.VisitorEditComponent,
                visitor_detail_component_1.VisitorDetailComponent,
                visitor_pass_component_1.VisitorPassComponent,
                visitor_list_dashboard_component_1.VisitorListDashboardComponent,
                visitor_pre_approved_component_1.VisitorPreApprovedComponent
            ],
            imports: [
                common_1.CommonModule,
                visitor_routing_1.VisitorRoutingModule,
                ngx_spinner_1.NgxSpinnerModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                angular_datatables_1.DataTablesModule,
                application_pipe_module_1.ApplicationPipeModule
            ],
            exports: [
                visitor_list_component_1.VisitorListComponent,
                visitor_list_dashboard_component_1.VisitorListDashboardComponent
            ]
        })
    ], VisitorModule);
    return VisitorModule;
}());
exports.VisitorModule = VisitorModule;
