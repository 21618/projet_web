import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  baseURL = "http://localhost:8000/";
  loginPath = "login";
  registerPath = "register";

  constructor(private http : HttpClient) { }
  
  logIn(credentials : any) {
	return this.http.post(this.baseURL+this.loginPath, credentials);
  }
  
  register(userinfo : any) {
	return this.http.post(this.baseURL+this.registerPath, userinfo);
  }
}
