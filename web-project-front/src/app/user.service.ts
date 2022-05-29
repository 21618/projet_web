import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export interface Profile {

}

export class UserService {

  constructor(private http : HttpClient) { }
  
  getUserProfile() {
  
  }
}
