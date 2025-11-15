import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from '../adapters/storage/cookie.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const publicRoutes = ['/animals', '/login', '/register'];
  
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));
  
  if (isPublicRoute) {
    return next(req);
  }
  
  const cookieService = inject(CookieService);
  const token = cookieService.get('auth_token');

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};