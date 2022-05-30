import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  firstname = "";
  balance = 0;
  errorMessage = "";
  transactionInfo : any;
  editMode : boolean = false;
  transactions : any[] = [];
  selectedTransaction : number = -1;
  
  editTransactionForm = this.formBuilder.group({
	comment: ""
  })

  constructor(
  	private router : Router,
  	private userService : UserService,
  	private formBuilder : FormBuilder) { }

  ngOnInit(): void {
	this.getProfileInfo()
  }

  updateEditMenu() {
  	this.editMode = !this.editMode;
  }

  editTransaction(id : number) {
  	console.log(this.editTransactionForm.value, id)
  	this.userService.editTransactionComment(this.editTransactionForm.value, id)
	.subscribe(
	(response : any) => {
		//  Refresh profile once transaction comment is updated
		this.getProfileInfo()
	},
	(error) => {
		if(error.status === 401) {this.router.navigateByUrl("login")}
	})
  }

  deleteTransaction(id : number) {
  	this.userService.deleteTransaction(id)
	.subscribe(
	(response : any) => {
		//  Refresh profile once transaction is deleted
		this.getProfileInfo()
	},
	(error) => {
		if(error.status === 401) {this.router.navigateByUrl("login")}
	})
  }

  selectTransaction(transactionId : number) {
  	//  Unselect transaction if button "view" is clicked twice
  	if(transactionId === this.selectedTransaction) {
  		this.selectedTransaction = -1;
  	} else {
  		this.selectedTransaction = transactionId;
  	}
  	
	this.userService.getTransactionDetails(transactionId)
	.subscribe(
	(response : any) => {
		this.transactionInfo = response
		console.log(response)
	},
	(error) => {
		if(error.status === 401) {this.router.navigateByUrl("login")}
	})
  }

  getProfileInfo() {
  	//  Get user balance and firstname
	this.userService.getUserProfile()
	.subscribe(
	(response : any) => {
		this.firstname = response.profile.firstname;
		this.balance = response.profile.balance;
	},
	(error) => {
		if(error.status === 401) {
			this.router.navigateByUrl("login")
		} else {
			this.errorMessage = "An error occured."
		}
	})
	
	//  Get transaction list
	this.userService.getTransactionList()
	.subscribe(
	(response : any) => {
		this.transactions = response;
		console.log(response)
	},
	(error) => {
		if(error.status === 401) {
			this.router.navigateByUrl("login")
		} else {
			this.errorMessage = "An error occured."
		}
	})
  }
}
