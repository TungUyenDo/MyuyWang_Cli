import { Component, OnInit } from '@angular/core';
import { GlobalService} from '../../services/global.service';
import {UserService} from '../user.service';
import { environment } from '../../../environments/environment';
import { FormGroup ,Validators ,FormBuilder} from '@angular/forms';

import { AbstractControl } from '@angular/forms';



@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  //language
  actionSwitchLanguage:any;
  resSwitchLanguage:any;

  user:any = {
    email:"",
    firstName:"",
    lastName:"",
    token:"",
    username:"",
    password:"",
    confirmPassword:"",
  };

  //message
  message:any = {
    profile:{
      text: "",
      status: "",
      display: false
    },
    password:{
      text: "",
      status: "",
      display: false
    }
  }
  
  //loading
  loading:any ={
    updateProfile: false,
    changePassword: false
  }

  editUserForm:FormGroup;
  validatorConfirmPassword:any = false;

  constructor(private userService:UserService,private globalService:GlobalService,private fb: FormBuilder) {
    //listen Event switch Language
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res =>{
      this.resSwitchLanguage = res;
    });

    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage(); 

    //get profile user
    this.user = JSON.parse( this.globalService.getCookie(environment.prefix+"-login") );
    console.log(this.user);
  }

  ngOnInit() {

    //init validate
    this.editUserForm = this.fb.group({
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required]
    },{
      validator:confirmPassword()
    });

    console.log(this.editUserForm);
  }

  

  onSubmitUpdateProfile(){
    this.loading.updateProfile = true;
    this.message.profile.display = false;

    this.userService.updateProfile(this.user).subscribe(res =>{
      this.globalService.setCookie(environment.prefix + "-login" ,JSON.stringify(this.user) );
      this.message.profile ={
        text: "Update successfully",
        status: "success",
        display: true
      }
      this.loading.updateProfile = false;
      this.globalService.scrollTop(); 
    },error =>{ 
      this.globalService.logOut();
    });
    
   
  }

  onSubmitUpdatePassword(value){
    console.log(this.editUserForm);
    this.user.password = this.editUserForm.value.password;
    this.user.confirmPassword = this.editUserForm.value.confirmPassword;
    this.loading.changePassword = true;
    this.message.password.display = false;

    this.userService.updatePassword(this.user).subscribe(res =>{
      this.message.password ={
        text: "Update successfully",
        status: "success",
        display: true
      }
      this.loading.changePassword = false;
      this.globalService.scrollTop(); 
    },error =>{ 
      this.globalService.logOut(); 
    });
  }

  // confirmPassword(control: AbstractControl):{[key: string]: boolean} {
  //   console.log(control);
  //   let password = control.get("password");
  //   let confirmPassword = control.get("password");
  //   if(password !== confirmPassword) {
  //     return {confirmPassword : true} ;
  //   }
  //   return null;
  // }
}
export function confirmPassword(){
  return (control: AbstractControl): {[key: string]: any} => {
    let password = control.get("password").value;
    let confirmPassword = control.get("confirmPassword").value;
  
    if(password !== confirmPassword) {
      return {confirmPassword : true} ;
    }
    return null;
  };
}
