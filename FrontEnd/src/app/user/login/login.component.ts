import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup,  ReactiveFormsModule,  Validators, } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectError, selectLoading, selectUser } from '../../states/user/user.selector';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  loginData: FormGroup
  loading$ = this.store.select(selectLoading)
  error$ = this.store.select(selectError)
  user$=this.store.select(selectUser)
  constructor(private userservice:UserService,private router:Router,private store:Store<any>) {

    this.loginData = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(8)])
    })
  }
  login() {
    if (this.loginData.valid) {
      this.userservice.loginUser(this.loginData.value).subscribe({
        next: (res) => {
          if (res.err) {
            alert(res.message)
          } else if (res.message === 'login successful') {
            localStorage.setItem('token', res.token)
            this.router.navigate(['/'])
          }

        },
        error: (err) => {
          console.log(err)
          alert('login error please try again')
        }

      })
    }
  }
}
