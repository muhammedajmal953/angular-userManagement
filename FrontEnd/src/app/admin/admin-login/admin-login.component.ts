import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  loginData: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  constructor(private adminService: AdminService, private router: Router) {}
  login() {
    if (!this.loginData.valid) {
      this.loginData.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginData.value;
    this.adminService.adminLogin({ email, password }).subscribe((res) => {
      if (res) {
        localStorage.setItem('adminToken', res.token);
        this.router.navigate(['/admin']);
      }
    });
  }
}
