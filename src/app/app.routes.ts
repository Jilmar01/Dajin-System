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
        path: '',
        component: Welcome
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: [Rol.ADMIN] },
        loadChildren: () => import('./features/user/user.routes')
          .then(r => r.USER_ROUTES)
      },
      {
        path: 'categories',
        canActivate: [roleGuard],
        data: { roles: [Rol.ADMIN, Rol.USER] },
        loadChildren: () => import('./features/category/category.routes')
          .then(r => r.CATEGORY_ROUTES)
      },
      {
        path: 'departments',
        canActivate: [roleGuard],
        data: { roles: [Rol.ADMIN, Rol.USER] },
        loadChildren: () => import('./features/department/department.routes')
          .then(r => r.DEPARTMENT_ROUTE)
      },
      {
        path: 'assets',
        canActivate: [roleGuard],
        data: { roles: [Rol.ADMIN, Rol.USER] },
        loadChildren: () => import('./features/asset/asset.routes')
          .then(r => r.ASSET_ROUTEa)
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
