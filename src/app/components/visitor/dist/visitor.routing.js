"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VisitorRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var auth_guard_1 = require("../../auth/auth.guard");
var visitor_component_1 = require("./visitor/visitor.component");
var visitor_list_component_1 = require("./visitor-list/visitor-list.component");
var visitor_add_component_1 = require("./visitor-add/visitor-add.component");
var visitor_edit_component_1 = require("./visitor-edit/visitor-edit.component");
var visitor_pass_component_1 = require("./visitor-pass/visitor-pass.component");
var visitor_pre_approved_component_1 = require("./visitor-pre-approved/visitor-pre-approved.component");
var routes = [
    {
        path: 'visitor',
        component: visitor_component_1.VisitorComponent,
        canActivate: [auth_guard_1.AuthGuard],
        children: [
            {
                path: 'list',
                component: visitor_list_component_1.VisitorListComponent
            },
            {
                path: 'add',
                component: visitor_add_component_1.VisitorAddComponent
            },
            {
                path: 'edit/:id',
                component: visitor_edit_component_1.VisitorEditComponent
            },
            {
                path: 'pass/:id',
                component: visitor_pass_component_1.VisitorPassComponent
            },
            {
                path: 'preapproved',
                component: visitor_pre_approved_component_1.VisitorPreApprovedComponent
            }
        ]
    }
];
var VisitorRoutingModule = /** @class */ (function () {
    function VisitorRoutingModule() {
    }
    VisitorRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], VisitorRoutingModule);
    return VisitorRoutingModule;
}());
exports.VisitorRoutingModule = VisitorRoutingModule;
