import { Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { authGuardGuard } from './auth-guard.guard';
import { DashBoardComponent } from './admin/dash-board/dash-board.component';
import { isAdminGuard } from './admin-guard.guard';
import { AddUserComponent } from './admin/add-user/add-user.component';
import { EditUserComponent } from './admin/edit-user/edit-user.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';

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
        title: 'admin-login',
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
    path: 'admin',
    canActivateChild: [isAdminGuard],
    children: [
      {
        path: '',
        title: 'Dashboard',
        component:DashBoardComponent
      },
      {

        path: 'login',
        title: 'Dashboard',
        component:AdminLoginComponent
      },
      {
        path: 'add-user',
        title: 'Add User',
        component:AddUserComponent
      },
      {
        path: 'edit-user',
        title: 'Edit User',
        component:EditUserComponent
      }

    ]
  },
  {
    path:'**',
    redirectTo:''
  }
];
