import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User  } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl ="http://localhost:8080";
  private response = [];

  constructor(private http: HttpClient) { }

  registerUser(user : User){
    return this.http.post(this.baseUrl+"/sl/user/doAddUser", user);
  }

  isMobileExists(user : User){
    return this.http.post(this.baseUrl+"/sl/user/doCheckRegisteredMobile", user);
  }

  isEmailExists(user : User){
    return this.http.post(this.baseUrl+"/sl/user/doCheckRegisteredEmail", user);
  }
}
