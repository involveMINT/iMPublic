import { InjectionToken } from '@angular/core';
import { FrontendRoutes, FRONTEND_ROUTES_TOKEN } from '@involvemint/shared/domain';

export const FRONTEND_ROUTES = new InjectionToken<FrontendRoutes>(FRONTEND_ROUTES_TOKEN);
