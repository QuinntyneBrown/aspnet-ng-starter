import {Routes, RouterModule} from '@angular/router';
import {LoginPageComponent} from "./users/login-page.component";
import {SetTenantPageComponent} from "./tenants/set-tenant-page.component";
import {TenantGuardService} from "./shared/guards/tenant-guard.service";

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'contacts',
        pathMatch:'full'
    },    
    {
        path: 'tenants/set',
        component: SetTenantPageComponent
    },
    {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [
            TenantGuardService
        ]
    }
];

export const RoutingModule = RouterModule.forRoot([
    ...routes
]);

export const routedComponents = [
    LoginPageComponent,
    SetTenantPageComponent
];