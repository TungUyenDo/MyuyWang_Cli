import { Component, OnInit } from '@angular/core';
import {MemberPageService} from "../member-page.service";
import * as moment from 'moment';

@Component({
  selector: 'app-list-member',
  templateUrl: './list-member.component.html',
  styleUrls: ['./list-member.component.scss']
})
export class ListMemberComponent implements OnInit {
   listMember;
   disableAll = false;
   selectedMember;
   statusChanged = null;

  constructor(private mbPgSvs : MemberPageService) {}


  ngOnInit() {
    this.mbPgSvs.getListMember().subscribe(res => this.listMember = res);
  }

  onEditMember(member) {
    if(this.selectedMember) {
      this.selectedMember = null;
      this.disableAll = false;
      if(this.statusChanged !== (member.status && null)) {
        this.mbPgSvs.updateMember({
          "id": member.id,
          "status": this.statusChanged,
          "lastName": member.last_name,
          "firstName": member.first_name,
          "action": "update"
        }).subscribe(
          res=> this.listMember[this.listMember.indexOf(member)].status = this.statusChanged,
          err => console.log(err)
        );
      }
    } else {
      this.selectedMember = member;
      this.disableAll = true;
    }
  }

  onChangeStatus(element) {
    this.statusChanged = element.value;
  }

  onDeleteMember(member) {
    this.mbPgSvs.delMember(member.id).subscribe(
      res => this.listMember.splice(this.listMember.indexOf(member), 1),
      err => console.log(err)
    )
  }

  onOpenSocialTab(member) {
    let url = (member.loginType === 'facebook')
                ? 'https://www.facebook.com/'
                : 'https://plus.google.com/';
    console.log(url);
    console.log(member.loginType);
    window.open(url + member.id) ;
  }
}
