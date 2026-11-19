import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;
      if (error.status === 0) {
        message = 'Unable to connect to the server';
      } else {
        message = error.error?.message ?? 'An unexpected error occurred';
      }

      if (error.status === 401) {
        authService.logout();
        void router.navigate(['/login']);
      }

      return throwError(() => new Error(message));
    })
  );
};
