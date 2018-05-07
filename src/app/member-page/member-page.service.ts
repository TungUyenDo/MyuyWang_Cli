import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import 'rxjs/Rx';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class MemberPageService {

  public recentLoginUser = new Subject();

  constructor(private http: HttpClient) {}


  public getListMember() {
    return this.http.get(environment.pathUrlApi+"/member/list").map(res => res);
  }

  public updateMember(member: Object) {
    return this.http.post(environment.pathUrlApi + "/member/update", member)
      .map(res => res);
  }

  public delMember(id) {
    return this.http.post(environment.pathUrlApi + "/member/update", {
      "id": id,
      "action": "delete"
    })
      .map(res => res);
  }
}
