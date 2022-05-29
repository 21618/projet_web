import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  newUid = 0;
  registerError = "";

  registerForm = this.formBuilder.group({
	firstname: "",
	password: ""
  })

  constructor(
  	private router : Router,
  	private formBuilder: FormBuilder,
  	private auth : AuthService) { }

  ngOnInit(): void {
  }

  register() {
	this.auth.register(this.registerForm.value)
	.subscribe((response: any) => {
		//  Redirect to profile if uid/password is valid
		console.log(response);
		this.registerError = "";
		this.newUid = response["uid"];
	},
	(error) => {
		if(error.status === 400) {
			this.registerError = "Password length must be between 10 and 20.";
		} else {
			this.registerError = "An error occured, please retry later.";
		}
	})
  }
  
  loginMenu() {
	this.router.navigateByUrl("/login")
  }
}
