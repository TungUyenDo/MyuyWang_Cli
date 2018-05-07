import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/Rx';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {
  }

  //------------language-------------------------
  public getListLanguage() : Observable<any[]> {
    return this.http
      .get("./assets/language.json")
      .map(response => response)
      .catch(this.handleError);
  }

  //-------------------category----------------------
  public getListCategory() : Observable<any[]> {
    return this.http
      .get(environment.pathUrlApiBackEnd+"/category/list")
      .map(response => response)
      .catch(this.handleError);
  }
  public createCategory(data) : Observable<any> {
    let body = data;

    return this.http
      .post(environment.pathUrlApi+"/category/create", body)
      .map(response => response)
      .catch(this.handleError);
  }
  public updateCategory(data) : Observable<any> {
    let body = data;

    return this.http
      .post(environment.pathUrlApi+"/category/update", body)
      .map(response => response)
      .catch(this.handleError);
  }
  public videoscategory(data): Observable<any>{
    let body = data;

        return this.http
          .post(environment.pathUrlApiBackEnd+"/category/listvideo", body)
          .map(response => response)
          .catch(this.handleError);
  }
  public videoscategoryPromise() : Observable<any>{

    return Observable.forkJoin([
      this.getListCategory(),
      this.getListVideo()
    ]).map(res=> res)
    .catch(this.handleError);
  }

  public uploadVideo(data): Observable<any>{
    let body = data;
    return this.http
      .post("http://coach.acc-svrs.com/api/v2/coach/upload", body)
      .map(response => response)
      .catch(this.handleError);
  }

  //----------------------member----------------------
  public getListMember() : Observable<any[]> {
	  return this.http
      .get(environment.pathUrlApi+"/member")
      .map(response => response)
      .catch(this.handleError);
  }

  public login(id , password) : Observable<any> {
    let bodyString = JSON.stringify({
      "username":id,
      "password":password
    });
    return this.http
      .post(environment.pathUrlApiBackEnd+"/admin/login",bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  //-------------------Video-------------------------
  public getListVideo() : Observable<any[]> {
    return this.http
      .get(environment.pathUrlApi+"/videos")
      .map(response => response)
      .catch(this.handleError);
  }

  public getDetailVideo(id) : Observable<any> {
    return this.http
      .get(environment.pathUrlApi+"/videos/"+id)
      .map(response => response)
      .catch(this.handleError);
  }

  public updateVideo(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApi+"/videos/update",bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  public getDetailPromise(param) : Observable<any>{
    return Observable.forkJoin([
      this.getDetailVideo(param),
      // this.getListTags(),
      this.getListCategory(),
      this.getListPlaylist()
    ]).map(res=> res)
    .catch(this.handleError);
  }

  public getListVideoPromise(): Observable<any>{
    return Observable.forkJoin([
      this.getListVideo(),
      this.getListCategory()
    ]).map(res=> res)
    .catch(this.handleError);
  }

  // public generateStaticHTML(param): Observable<any>{
  //   return this.http
  //   .get(environment.pathUrlApi+"/videos/create/" + param)
  //   .map(response =>  response)
  //   .catch(this.handleError);
  // }

  public generateStaticHTML(param): Observable<any> {
    return this.http
      .get(environment.pathUrlGenerateStaticHTML + "/videos/create/" + param)
      .map(response => response)
      .catch(this.handleError);
  }

  public clearCloundFont(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlClearCloudFont,bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  public deleteVideo(param): Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post( environment.pathUrlApiBackEnd + "/videos/delete",bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  public getViewVideo(param):Observable<any> {
    return this.http
      .get( environment.pathUrlGenerateStaticHTML + "/videos/getview/" + param)
      .map(response => response)
      .catch(this.handleError);
  }

  //-------------------------- Static Article ---------------------
  public getListStaticArticle() : Observable<any> {
    return this.http
      .get(environment.pathUrlApiBackEnd + "/static")
      .map(response => response)
      .catch(this.handleError);
  }

  public updateStaticArticle(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApiBackEnd +"/static/update",bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  public createStaticArticle(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApiBackEnd +"/static/create",bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  public deleteStaticArticle(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApiBackEnd +"/static/update",bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  //-------------------------- playlist ------------------------------
  public getListPlaylist() : Observable<any> {
    return this.http
      .get(environment.pathUrlApiBackEnd + "/playlist")
      .map(response => response)
      .catch(this.handleError);
  }

  public updatePlaylist(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApiBackEnd +"/playlist/update",bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  public createPlaylist(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApiBackEnd +"/playlist/create", bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  //--------------------------upload image-----------------
  public uploadImage(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApi +"/banner/upload", bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  //-----------------------------Tags-----------------------
  public getListTags() : Observable<any> {
    return this.http
      .get(environment.pathUrlApiBackEnd + "/tags")
      .map(response => response)
      .catch(this.handleError);
  }

  //------------------------------User---------------------------
  public updateProfile(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApiBackEnd +"/admin/update", bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

  //----------------------------FAQ-------------------------------
  public getListFAQ() : Observable<any> {
    return this.http
      .get(environment.pathUrlApiBackEnd + "/faq")
      .map(response => response)
      .catch(this.handleError);
  }

  public updateFAQ(param) : Observable<any> {
    let bodyString = JSON.stringify(param);
    return this.http
      .post(environment.pathUrlApiBackEnd +"/faq/update", bodyString)
      .map(response => response)
      .catch(this.handleError);
  }

 //-------------------------error handle
  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
}
