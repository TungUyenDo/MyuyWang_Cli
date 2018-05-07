import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup , Validators} from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  createUserForm : FormGroup;

  //user
  email:any ="";
  password:any ="";
  firstName: any = "";
  lastName: any ="";

  constructor(private fb: FormBuilder) {
   }

  ngOnInit() {
    console.log(1);
  }

}
