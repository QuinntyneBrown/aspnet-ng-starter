import {Routes, RouterModule} from '@angular/router';
import {LoginPageComponent} from "./users/login-page.component";
import {SetTenantPageComponent} from "./tenants/set-tenant-page.component";
import {TenantGuardService} from "./shared/guards/tenant-guard.service";

import { HOME_ROUTES } from "./home/home.module";
import { TENANT_ROUTES } from "./tenants/tenants.module";
import { USER_ROUTES } from "./users/users.module";

export const RoutingModule = RouterModule.forRoot([
    ...HOME_ROUTES,
    ...TENANT_ROUTES,
    ...USER_ROUTES
]);