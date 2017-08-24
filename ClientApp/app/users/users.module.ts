import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { TenantGuardService } from "../shared/guards/tenant-guard.service";
import { LoginComponent } from './login.component';
import { LoginPageComponent } from "./login-page.component";

const declarables = [LoginComponent, LoginPageComponent];
const providers = [];

export const USER_ROUTES = [
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [
            TenantGuardService
        ]
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
    exports: [declarables],
    declarations: [declarables],
    providers: providers
})
export class UsersModule { }
