import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formData!: FormGroup;
  constructor(private userService: UserService,private router:Router) {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]+@gmail\.com$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword:new FormControl('',[Validators.required,Validators.maxLength(8)])
    },);
  }
  register() {
    if (this.formData.valid) {
      console.log(this.formData.value);

      this.userService.registerUser(this.formData.value).subscribe({
        next: (res) => {

          if (res.message === 'user saved successfully') {
            localStorage.setItem('token', res.token)
            this.router.navigate(['/'])
          }
        }
      });

    } else {
      this.formData.markAllAsTouched()
    }
  }
}
