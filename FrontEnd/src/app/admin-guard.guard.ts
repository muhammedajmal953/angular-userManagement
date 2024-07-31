import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const isAdminGuard: CanActivateChildFn = (childRoute, state) => {
  const token: string | null = localStorage.getItem('adminToken');
  const route: Router = inject(Router);
  const routes: string[] = ['/admin/login'];

  if(!token && !routes.includes(state.url)){
    route.navigate(['/admin/login'])
    return false;
  }else if(token && routes.includes(state.url)){
    route.navigate(['/admin']);
    return false;
  }else if(!token && routes.includes(state.url)){
    return true;
  }

  return true
};
