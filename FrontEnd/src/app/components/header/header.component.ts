import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  router: Router = inject(Router);
  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  };

}
