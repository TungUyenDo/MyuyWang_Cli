import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";

@Component({
	selector: 'app-list-user',
	templateUrl: './list-user.component.html',
	styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  listUser;
	data:any[] = [
		{
			username: 'test1',
			date: new Date()
		},
		{
			username: 'test2',
			date: new Date()
		},
		{
			username: 'test3',
			date: new Date()
		},
		{
			username: 'test4',
			date: new Date()
		}
	]
	constructor( private uSvs: UserService) { }

	ngOnInit() {
    this.uSvs.getListUser().subscribe(
      res => {
        console.log(res);
        this.listUser = res
      },
      err => console.log(err)
    )
	}

}
