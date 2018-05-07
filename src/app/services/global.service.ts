import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Router , ActivatedRoute} from '@angular/router';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';

@Injectable()
export class GlobalService {

  constructor(private router:Router , private route:ActivatedRoute) { }

  //config ckeditor
  public configCkEditor(){
    let ckeditorConfig = {
      extraPlugins: 'divarea',
      toolbar :[
        ['Format','Font','FontSize','-',
          'Bold','Italic','Underline','-','NumberedList','BulletedList','-','Cut','Copy','Paste','-',
          'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
     ]
    }
    return ckeditorConfig;
  }

  public logOut():any{
    this.setCookie(environment.prefix+"-login","");
    $(location).attr('href', '/login');
  }


  //switch language
  switchLanguage = new Subject();

  resSwithLanguage = this.switchLanguage.asObservable();

  public onSwitchLanguage(language){
    this.switchLanguage.next(language)
  }

  public getCurrentLanguage(){
    if(!localStorage.getItem("translation")){
      localStorage.setItem("translation","en")
    }
    return localStorage.getItem("translation") ;
  }

  public formatDate(date) {
    if(date) {
      return moment(new Date(date)).format('DD-MM-YYYY');
    }

    return false;
  }

  public scrollTop(){
    $("html, body").stop().animate({scrollTop:$(".content-wrapper").scrollTop()}, 500, 'swing');
  }

  public setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
  }

  public getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }
  public checkCookie(cname) {
    var name = this.getCookie(cname);
    if (name != "") {
        console.log("cookie is:" + name);
    } else {
      console.log("cookie null")
    }
  }
  
  
  public changeDomainImage(url){
    url = url + "//";
    //remove http:// 
    let arrUrl = url.split("//");
    let pathUrlFile ="";
    if(arrUrl.length > 2){
      pathUrlFile = arrUrl[1];
    }else{
      pathUrlFile = arrUrl[0];
    }

    //remove domain out of link file
    pathUrlFile = pathUrlFile + "/";
    let arrUrlFile = pathUrlFile.split("/");

    //create new link with domain cloudfront
    let newLink = environment.pathUrlCloudFront;
    for(let i = 1 ; i < arrUrlFile.length - 1; i++){
      newLink += "/" + arrUrlFile[i];
    }

    return newLink;
  }

  public savePageNumberWhenChangePageDatatable(datatableElement , route ,router , linkCurrentPage){
  
    datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      
      let pageNumber:number = parseInt(route.snapshot.queryParamMap.get("page") );
      
      if(pageNumber){
        dtInstance.page(pageNumber).draw("page");
      }
      dtInstance.tables().on("draw.dt", function(){
        router.navigate([linkCurrentPage], { queryParams: { page: dtInstance.page.info().page } });
      });
    });
  }

  public templateDataVideo(){
    return {
      status: false,
      poster: " ",
      id: " ",
      playlistId: " ",
      thumbnail: {
        start: " ",
        fiffteen_seconds: " ",
        half_movie_length: " "
      },
      duration: " ",
      tags: [],
      replace_id: " ",
      summary: {
        en: " ",
        cn: " "
      },
      isPrivate: "0",
      advertise: " ",
      slug: " ",
      comments: [],
      createdAt: 0,
      titleLower: {
        en: " ",
        cn: " "
      },
      views: "0",
      user_liked: [],
      sypnosis: {
        en: " ",
        cn: " "
      },
      quality: {
        FHD_720p: " ",
        FHD_1080p: " ",
        FHD_480p: " ",
        FHD_360p: " "
      },
      backgroundImage: " ",
      isTrending: true,
      updatedAt: 0,
      genres: [],
      video: " ",
      title: {
        en: " ",
        cn: " "
      }
    }
  }
}
