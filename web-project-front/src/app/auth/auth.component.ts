import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  
  loginError = "";
  
  loginForm = this.formBuilder.group({
	uid: "",
	password: ""
  })
  
  constructor(
  	private router : Router,
  	private formBuilder: FormBuilder,
  	private auth : AuthService) { }

  ngOnInit(): void {
  }

  logIn() {
	this.auth.logIn(this.loginForm.value)
	.subscribe((response) => {
		//  Redirect to profile if uid/password is valid
		this.router.navigateByUrl("/profile")
	},
	(error) => {
		if(error.status === 401) {
			this.loginError = "Invalid credentials.";
		} else {
			this.loginError = "An error occured, please retry later.";
		}
	})
  }

  registerMenu() {
	this.router.navigateByUrl("/register")
  }
}
