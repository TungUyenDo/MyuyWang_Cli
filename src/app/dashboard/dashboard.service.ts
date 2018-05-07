import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import 'rxjs/Rx';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class DashboardService {


  constructor(private http: HttpClient) {}


  public getListMember() {
    return this.http.get(environment.pathUrlApi+"/member/list").map(res => res);
  }

  public getListVideo() {
    return this.http.get(environment.pathUrlApi+"/videos").map(res => res);
  }

}
