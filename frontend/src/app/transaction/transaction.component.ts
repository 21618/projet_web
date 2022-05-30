import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  transactionSubmitted = false;
  errorMessage : string = "";
  transactionForm = this.formBuilder.group({
	amount: "",
	destinationId: "",
	comment: ""
  });

  constructor(
  	private formBuilder : FormBuilder,
  	private router : Router,
  	private userService : UserService) { }

  ngOnInit(): void {
  }

  createTransaction() {
	this.userService.newTransaction(this.transactionForm.value)
	.subscribe(
	(response : any) => {
		this.transactionSubmitted = true;
		this.errorMessage = "";
	},
	(error) => {
		if(error.status === 401) {
			this.router.navigateByUrl("login");
		} else {
			this.errorMessage = error.error.error;
			console.log(this.errorMessage)
		}
	})
  }
}
