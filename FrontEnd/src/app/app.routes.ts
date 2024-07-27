import { Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { authGuardGuard } from './auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    canActivateChild: [authGuardGuard],
    children: [
      {
        path: '',
        title: 'Home',
        component: HomeComponent
      },
      {
        path: 'login',
        title: 'Login',
        component:LoginComponent
      },
      {
        path: 'register',
        title: 'Register',
        component:RegisterComponent
      }
    ]
  },
  {
    path:'**',
    redirectTo:''
  }
];
