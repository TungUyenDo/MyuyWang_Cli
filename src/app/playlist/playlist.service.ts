import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import * as _ from "underscore";

@Injectable()
export class PlaylistService {

  constructor(private apiService:ApiService) { }

  getListPlaylist(): any{
  	return this.apiService.getListPlaylist();
  }

  updatePlaylist(param , arrDefaultVideoOfPlaylist ): any{
    let deleteItem = [];
    
    //for default video of playlist
    arrDefaultVideoOfPlaylist.forEach(videoId => {
      //if video default not exist in current video playlist then push to array
      if(!(<any>_).find( param.data.items , video => ( video.id == videoId.id ) ) ){
        deleteItem.push(videoId);
      }
    });
    
    let newValue = param;
    if(!newValue.data.title.cn){
      newValue.data.title.cn = " ";
    }
    newValue.data["deleteItems"] = deleteItem;

    console.log(newValue);
  	return this.apiService.updatePlaylist(newValue);
  }

  createPlaylist(param): any{
    let newValue = param ;
    if(!newValue.data.title.cn){
      newValue.data.title.cn = " ";
    }
    return this.apiService.createPlaylist(newValue);
  }

  getListVideos():any {
    return this.apiService.getListVideo();
  }
  
  uploadImage(param):any{
    return this.apiService.uploadImage(param);
  }
}
