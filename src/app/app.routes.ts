import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Main } from './layout/main/main';
import { roleGuard } from './core/guards/role.guard';
import { Welcome } from './features/welcome/welcome';
import { Rol } from './models/rol';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((route) => route.AUTH_ROUTES),
  },
  {
    path: '',
    component: Main,
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: [Rol.ADMIN] },
        loadChildren: () => import('./features/user/user.routes')
          .then(r => r.USER_ROUTES)
      },
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
