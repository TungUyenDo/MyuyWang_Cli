import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";


@Injectable()
export class TagService {

  constructor(private http: HttpClient) {}

  public getListTag() {
    return this.http.get(environment.pathUrlApiBackEnd + "/tags")
  }

  public createTag(title) {
    return this.http.post(environment.pathUrlApiBackEnd + "/tags/create", {
      "title": title
    })
  }

  public updateTag(body) {
    return this.http.post(environment.pathUrlApiBackEnd + "/tags/update", body)
  }

  public deleteTag(id) {
    return this.http.post(environment.pathUrlApiBackEnd + "/tags/update", {
      "id": id,
      "action": "delete"
    })
  }
}
