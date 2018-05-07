import { Component, OnInit , ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaylistService } from '../playlist.service';
import { GlobalService} from '../../services/global.service';
import { Subject } from 'rxjs/Subject';
import * as _ from "underscore";
import { DataTableDirective } from 'angular-datatables';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-update-playlist',
  templateUrl: './create-update-playlist.component.html',
  styleUrls: ['./create-update-playlist.component.scss']
})
export class CreateUpdatePlaylistComponent implements OnInit {


  environment:any = environment;
  
  type:any = "create";
  id: number;
  sub: any;

  videos:any;

  playlist: any = {
    data:{
      title:{
        en: "",
        cn: ""
      },
      items:[],
      poster:"",
    },
    id:""
  };
 //language
 actionSwitchLanguage:any;
 resSwitchLanguage:any;
 //list
 listVideos:any;
 dtTrigger: Subject<any> = new Subject();
 dtTriggerVideo: Subject<any> = new Subject();
 //playlist selected
 selectedPlaylist:any = {
   title: "",
 }

 //selected item
 selectedItem:any = {
  title:{
    en:"",
    cn:""
  }
 }

 //message
 message:any = {
   text: "",
   status: "",
   display: false
 }
 //loading
 loading:any = false;

 //language tabs
 languageTabs:any = 'english';

  //image Poster
  dataPoster: any;
  cropperSettingsPoster: CropperSettings;
  nameFilePoster:any ="";
  imageExtensionPoster:any = "";
  edittingPoster:any = false;

  //init array id video
  initArrIdVideo = [];

  @ViewChild('cropperPoster', undefined) cropperPoster:ImageCropperComponent;

 @ViewChild(DataTableDirective)
 dtElement: DataTableDirective;

 constructor(private playlistService : PlaylistService,
  private globalService:GlobalService,private route: ActivatedRoute) { 
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res => {
      this.resSwitchLanguage = res;
    });
    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();
  }

  ngOnInit() {
    let $this = this;

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      if(typeof params['id'] != "undefined"){
        this.type = "edit"; 
      }
    });

    //get detail category if type == 'edit'
    if(this.type == "edit"){
      let $this = this;
      this.playlistService.getListPlaylist().subscribe(res=>{
        //get playlist detail in list playlist
        this.playlist = _.find( res,value => (value.id == $this.id) );
        
        //save default arr ID video of playlist
        this.initArrIdVideo =this.playlist.data.items.slice(0);

        //render table
        this.dtTrigger.next();

        //call api get list video
        this.getListVideo(function(){});
      });
    }else{
      setTimeout(value =>{ $this.dtTrigger.next() } , 0 );
      this.getListVideo(function(){});
    }

   
    //init crop Poster
    this.cropperSettingsPoster = new CropperSettings();
    this.cropperSettingsPoster.noFileInput = true;
    this.cropperSettingsPoster.width = environment.sizePosterPlaylist.width;
    this.cropperSettingsPoster.height = environment.sizePosterPlaylist.height;
    this.cropperSettingsPoster.croppedWidth = environment.sizePosterPlaylist.width;
    this.cropperSettingsPoster.croppedHeight = environment.sizePosterPlaylist.height;
    this.cropperSettingsPoster.canvasWidth = 250;
    this.cropperSettingsPoster.canvasHeight = 345;

    this.dataPoster={};
  }

  onSubmit(){
    (this.type == "create") ? this.onCreatePlaylist() : this.onUpdatePlaylist();
  }

  onCreatePlaylist(){
    this.loading = true;
    this.message.display = false;
    this.playlistService.createPlaylist(this.playlist).subscribe(res =>{
      this.message ={
        text: "Create successfully",
        status: "success",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
    },error =>{
      this.message ={
        text: "Create failed",
        status: "error",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
    });
  }

  onUpdatePlaylist(){
    this.loading = true;
    this.message.display = false;
    this.playlistService.updatePlaylist(this.playlist , this.initArrIdVideo).subscribe(res =>{
      this.message ={
        text: "Update successfully",
        status: "success",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
      //save default arr ID video of playlist
      this.initArrIdVideo =this.playlist.data.items.slice(0);
    },error =>{
      this.message ={
        text: "Update failed",
        status: "error",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
    })
  }

  onOpenModel(){
    console.log(1);
  }

  onAddVideoInPlaylist(item){
    let newOrder = 0;
    //reach each video to get max order
    this.playlist.data.items.forEach(video => {
      if(video.order > newOrder){
        newOrder = parseInt(video.order);
      }
    });

    item.exist = true;
    let newValue = {
      id : item.id,
      title:{
        en: item.title.en,
        cn: item.title.cn
      },
      poster: item.poster,
      slug: item.slug,
      summary:{
        en: item.summary.en,
        cn: item.summary.cn
      },
      order: newOrder+1,
      createdAt:item.createdAt,
      updatetedAt:item.updatedAt
    };

    //check exist
    let exist = (<any>_).find(this.playlist.data.items, function(value){
      return value.id == newValue.id;
    });
    
    if(typeof exist == "undefined"){
      this.playlist.data.items.push(newValue);
    }

    this.reRenderTable();
  }

  onRemoveVideoInPlaylist(item){
    item.exist = false;
    let newValue = {
      id : item.id,
      title:{
        en: item.title.en,
        cn: item.title.cn
      },
      poster: item.poster,
      slug: item.slug,
      summary:{
        en: item.summary.en,
        cn: item.summary.cn
      }
    };
    
    //slice item
    this.playlist.data.items.splice(
      //find index
      this.playlist.data.items.indexOf(
        //find item in playlist video
        (<any>_).find(this.playlist.data.items,function(value){
          return value.id == newValue.id;
        }
      )
    ),1);

    //reRender
    this.reRenderListVideos();
    this.reRenderTable();
  }

  getListVideo(callback){
    //get list video
    this.playlistService.getListVideos().subscribe(res =>{
      let $this = this;
      this.videos = res;

      this.reRenderListVideos();

      this.dtTriggerVideo.next();
      
      callback();
    });

  }

  reRenderTable(){
    //reRender table
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  reRenderListVideos(){
    let $this = this;


    this.videos = this.filterVideoNotExistPlaylist(this.type);
    this.checkVideoExistPlaylist();
  }

  checkVideoExistPlaylist(){
    let $this = this;
    (<any>_).each(this.videos,function(value){
      value.exist = false;
      //check video exist
      if( (<any>_).find($this.playlist.data.items,function(item){
        return item.id == value.id;  
      })){
        value.exist = true;  
      }
    });
  }

  filterVideoNotExistPlaylist(type){
    let $this = this;
    if(type == "edit"){
      return (<any>_).filter(this.videos , function(video){
        return (video.playlistId == String($this.id) || video.playlistId == "0") ? true : false;
      });
    }else{
      return (<any>_).filter(this.videos , function(video){
        return (video.playlistId == "0") ? true : false;
      });
    }
  }

  onPosterChange($event){
    this.message.display = false;
    let $this = this;

    let file:File = $event.target.files[0];

    if( (file.size/1048576) > 2 ){
      this.message ={
        text: "this file exceeds the maximum upload size for this site",
        status: "error",
        display: true
      }
      setTimeout(function(value){
        $this.edittingPoster = false;
      },0);
    }
    // //get base64
    this.getBase64(file,function(res){

      //split name
      let splitName = file.name + ".";
      let arraySplitName = splitName.split(".");

        //get extension
        $this.imageExtensionPoster = arraySplitName[arraySplitName.length - 2];
        //get name
        for(let i=0 ; i < arraySplitName.length - 2; i++){
          if(i == 0){
            $this.nameFilePoster = arraySplitName[i];
          }else{
            $this.nameFilePoster =  $this.nameFilePoster + "." + arraySplitName[i];
          }
        };

      //put image into croped
      let image = new Image();
      image.src = res;
      $this.cropperPoster.setImage(image);

      $("#changePoster").val("");
    })
  }
  onUploadPoster(type){

    //get image src
    let res = this.dataPoster.image;
    //show loading
    this.loading = true;

    //get base64
    let base64Name = res.split(",")[1];

    //init data uplad poster
    let newValue = {
      image: base64Name,
    };
    newValue['imageName'] = this.nameFilePoster +  String(Date.now());
    newValue['imageExtension'] = this.imageExtensionPoster;

    //upload poster
    this.playlistService.uploadImage(newValue).subscribe(res=>{
      
      let newLocation = this.globalService.changeDomainImage(res.data.Location);

      this.playlist.data.poster = newLocation;
      this.loading = false;
      this.edittingPoster = false;

    },error=>{
      this.message ={
        text: "Upload image failed",
        status: "error",
        display: true
      }
      this.loading = false;
      this.edittingPoster = false;
    });
  }

  onKeyDownCheckNumber(e){
    let regexStr = '^[0-9]*$';
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
    // Allow: Ctrl+A
    (e.keyCode == 65 && e.ctrlKey === true) ||
    // Allow: Ctrl+C
    (e.keyCode == 67 && e.ctrlKey === true) ||
    // Allow: Ctrl+X
    (e.keyCode == 88 && e.ctrlKey === true) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
  let ch = String.fromCharCode(e.keyCode);
  let regEx =  new RegExp(regexStr);    
  if(regEx.test(ch))
    return;
  else
      e.preventDefault();
  }

  //-------------------------------function----------------------------

  getBase64(file , callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      callback(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  //Destroy
  ngOnDestroy() {
    (this.sub) ? this.sub.unsubscribe() : "";
  }

}
