import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  baseURL = "http://localhost:8000/";
  loginPath = "login";
  registerPath = "register";
  logoutPath = "logout";

  constructor(private http : HttpClient) { }
  
  logIn(credentials : any) {
	return this.http.post(this.baseURL+this.loginPath, credentials, {headers: {}, withCredentials: true});
  }
  
  register(userinfo : any) {
	return this.http.post(this.baseURL+this.registerPath, userinfo, {headers: {}, withCredentials: true});
  }
  
  logout() {
	return this.http.get(this.baseURL+this.logoutPath, {headers: {}, withCredentials: true})
  }
}
