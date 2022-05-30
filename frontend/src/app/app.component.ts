import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bank project';
  isLoggedPage = false;
  
  constructor(
  	private router : Router,
  	private authService : AuthService) { }
  
  displayTabs() : boolean {
    if(this.router.url === '/profile' || this.router.url === '/transaction') {
    	return true;
    }
    return false;
  }
  
  gotoProfile(): void {
	if(this.router.url !== "/profile") {
		this.router.navigateByUrl("/profile")
	}
  }
  
  gotoTransaction(): void {
	if(this.router.url !== "/transaction") {
		this.router.navigateByUrl("/transaction")
	}
  }
  
  logout(): void {
	console.log("logout")
	this.authService.logout()
	.subscribe((response) => {
		this.router.navigateByUrl("/login")
	},
	(error) => {
		this.router.navigateByUrl("/login")
	})
  }
  
  changeTab(event : any) {
	let tabIndex = event.index;
	if(tabIndex === 0) {
		//  Redirect to profile
		this.gotoProfile()
	} else if(tabIndex === 1) {
		//  Redirect to transaction menu
		this.gotoTransaction()
	} else if(tabIndex === 2) {
		//  Logout and go to login page
		this.logout()
	}
  }
}
