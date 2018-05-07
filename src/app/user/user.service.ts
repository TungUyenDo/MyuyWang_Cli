import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { ApiService } from '../services/api.service';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class UserService {

  constructor(private http: HttpClient,private apiService:ApiService) { }

  public getListUser() {
    return this.http.get(environment.pathUrlApiBackEnd + "/admin/list")
  }

  updateProfile(param):any{
    let newValue = {
      token : param.token,
      firstName: param.firstName,
      lastName: param.lastName,
      email: param.email
    }
    return this.apiService.updateProfile(newValue);
  }

  updatePassword(param):any{
    console.log(param);
    let passwordHash = Md5.hashStr(param.password);
    let newValue = {
      token : param.token,
      password: passwordHash
    }
    console.log(newValue);
    return this.apiService.updateProfile(newValue);
  }
}
