import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import 'rxjs/Rx';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs/Subject";

@Injectable()
export class BannerService {
  public listBanner: any;

  constructor(private http: HttpClient) {}

  public getListBanner() {
    return this.listBanner
  }

  public getListBannerFromAPI() {
    return this.http.get(environment.pathUrlApi+"/banner/all").map(res => {
      this.listBanner = res;
      return
    })
  }

  public updateBanner(banner) {
    return this.http.post(environment.pathUrlApi + "/banner/update", banner)
  }

  public generateImageLinkFromBase64(body) {
    return this.http.post(environment.pathUrlApi + "/banner/upload", body)
  }

  public createBanner(banner) {
    return this.http.post(environment.pathUrlApi + "/banner/create", banner)
  }

  public deleteBanner(id) {
    return this.http.post(environment.pathUrlApi + "/banner/update", {
      "id": id,
      "action": "delete"
    })
  }
}
