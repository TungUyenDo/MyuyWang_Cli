import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';
import {Md5} from 'ts-md5/dist/md5';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private apiService : ApiService,private router: Router,private globalService:GlobalService) {
    if(this.globalService.getCookie(environment.prefix+"-login")){
      $(location).attr('href', '');
    }
  }

  login:any = {
    id:"",
    password: "",
    fail: false
  }

  loading:any = true;

  ngOnInit() {
  }

  onLogin(){
    let $this = this;

    this.loading = false;
    this.login.fail = false;

    let passwordHash = Md5.hashStr(this.login.password);

    this.apiService.login(this.login.id , passwordHash).subscribe(res =>{
      let newItem = {
        email : res.email,
        firstName : res.firstName,
        lastName : res.lastName,
        id: res.id,
        token : res.token, 
        username: res.username
      }
      this.globalService.setCookie(environment.prefix + "-login",JSON.stringify(newItem));
      $(location).attr('href', '');
      
      this.loading = true;
    },error =>{
      $this.login.fail = true;
      $this.loading = true;
    })
  }

}
