import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token: string | null = inject(AuthService).getToken();

  const isSource: boolean = req.url.startsWith(environment.apiURL);
  const isLogin: boolean = req.url.endsWith('auth/login');

  if (token && isSource && !isLogin) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
