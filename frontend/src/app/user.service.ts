import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class UserService {
  baseURL = "http://localhost:8000/";

  constructor(private http : HttpClient) { }
  
  getUserProfile() {
	return this.http.get(this.baseURL + "profile", {headers: {}, withCredentials: true});
  }
  
  getTransactionList() {
	return this.http.get(this.baseURL + "transactions", {headers: {}, withCredentials: true});
  }
  
  getTransactionDetails(id : number) {
	return this.http.get(this.baseURL + "details/"+ id, {headers: {}, withCredentials: true});
  }
  
  newTransaction(newTransaction : any) {
	return this.http.post(this.baseURL + "createTransaction", newTransaction, {headers: {}, withCredentials: true})
  }
  
  deleteTransaction(id : number) {
  	return this.http.delete(this.baseURL + "delete/" + id, {headers: {}, withCredentials: true})
  }
  
  editTransactionComment(comment : any, id : number) {
	return this.http.put(this.baseURL + "edit/" + id, comment, {headers: {}, withCredentials: true})
  }
}
