import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interface/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   api="http://localhost:8001"
  constructor(private http: HttpClient) { }

  registerUser(data: User): Observable<any> {
    return this.http.post(`${this.api}/register`, data, this.httpOptions());
  }

  loginUser(data: { email: string; password: string; }): Observable<any> {


    return this.http.post(`${this.api}/login`, data, this.httpOptions());
  }

  getUserData(): Observable<any> {
    return this.http.get(`${this.api}/user`, this.httpOptions());
  }

  updateUser(data: User): Observable<any> {
    return this.http.put(`${this.api}/updateUser`, data, this.httpOptions());
  }

  httpOptions() {
    const token: string = localStorage.getItem('token') ?? "";

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
       })
    };
   }
}
