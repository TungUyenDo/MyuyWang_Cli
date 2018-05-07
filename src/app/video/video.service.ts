import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as _ from 'underscore';

@Injectable()
export class VideoService {

  constructor(private apiService:ApiService) { }

  getListVideo() : any {
  	return this.apiService.getListVideo();
  }

  getDetailVideo(id) : any {
  	return this.apiService.getDetailVideo(id);
  }

  updateVideo(param) : any {
    
    let playlistId:any = param.playlistId;
    let newValue = {
      id:param.id,
      title:{
        cn: param.title.cn,
        en: param.title.en
      },
      titleLower :{
        cn: param.title.cn.toLowerCase(),
        en: param.title.en.toLowerCase()
      },
      summary:{
        cn: param.summary.cn,
        en: param.summary.en
      },
      sypnosis:{
        cn: param.sypnosis.cn,
        en: param.sypnosis.en
      },
      status:param.status,
      isTrending: param.isTrending || false,
      isPrivate: param.isPrivate || "0",
      slug:param.slug
    }
    //--------------tags----------------------------------
    // let tags;
    // if(param.tags.length == 0){
    //   newValue['tags'] = [];
    // }else{
    //   tags = _.map(param.tags,function(value:any){
    //     if(value){
    //       return (typeof value.text == "undefined" || !value.text) ? "" : value['text'];
    //     }else{
    //       return "";
    //     }
    //   });
    //   if(tags[0]) newValue['tags'] = tags;  
    // }
    

    //----------------categories-------------------------------
    let categories = _.map(param.genres,function(value:any){
      return (typeof value.id == "undefined") ? "" : value['id'];
    });
    if(param.genres.length == 0) newValue['genres'] = [];
    if(categories[0]) newValue['genres'] = categories;  
    
    //------------------------playlist--------------------------
    if(param.playlistId.length == 0) newValue['playlistId'] = "0";
    if(playlistId[0]) newValue['playlistId'] = playlistId[0].id ;
    
    //------------------------poster---------------------------
    (!param.poster) ? newValue['poster'] = " " : newValue['poster'] = param.poster;
    //------------------------background----------------------
    (!param.backgroundImage) ? newValue['backgroundImage'] = " " : newValue['backgroundImage'] = param.backgroundImage;
    
  	return this.apiService.updateVideo(newValue);
  }

  uploadImage(param):any{
    return this.apiService.uploadImage(param);
  }

  getListTags():any{
    return this.apiService.getListTags();
  }  

  getListCategory():any{
    return this.apiService.getListCategory();
  }

  getListPlaylist():any{
    return this.apiService.getListPlaylist();
  }

  getDetailPromise(param):any{
    return this.apiService.getDetailPromise(param);
  }

  getListVideoPromise():any{
    return this.apiService.getListVideoPromise();
  }

  generateStaticHTML(id):any{
    return this.apiService.generateStaticHTML(id);
  }

  uploadVideo(data):any{
    return this.apiService.uploadVideo(data);
  }

  clearCloundFont(slug):any{
    return this.apiService.clearCloundFont(slug);
  }

  deleteVideo(data):any{
    return this.apiService.deleteVideo(data);
  }

  getViewVideo(id):any{
    return this.apiService.getViewVideo(id);
  }

  updateViewVideo(param):any{
    return this.apiService.updateVideo(param);
  }

  updatePlaylist(param , deleteItem ): any{
    
    let newValue = param;

    newValue.data["deleteItems"] = [deleteItem];

  	return this.apiService.updatePlaylist(newValue);
  }
}
