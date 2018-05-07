import { Component, OnInit, OnDestroy , ViewChild } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { VideoService } from '../video.service';
import { GlobalService} from '../../services/global.service';
import * as _ from "underscore";
import * as AWS from 'aws-sdk';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-detail-video',
  templateUrl: './detail-video.component.html',
  styleUrls: ['./detail-video.component.scss']
})
export class DetailVideoComponent implements OnInit {
  environment:any = environment;

  pathUrlFrontEnd:any = environment.pathUrlFrontEnd;

  videoDetail:any = {
    title:{
      en:"",
      cn:""
    },
    summary:{
      en : "",
      cn : ""
    },
    sypnosis:{
      en :"",
      cn :""
    },
    quality:{
      FHD_360p:"",
      FHD_480p:"",
      FHD_720p:"",
      FHD_1080p:""
    },
    playlistId:{
      id:"",
      text:"'"
    },
    tags:[],
    genres:[],
    isPrivate:'0',
    isTrending: false,
    status:true,
    backgroundImage:"",
    views:"loading...",
    tempViews:"0"
  }

  loading:any = {
    poster: false,
    tags: false,
    detail: true,
    categories: false,
    playlist:false,
    background: false,
    views:true
  }

  //list
  listTags:any;
  listCategories:any;
  listPlaylist:any;

  //message
  message:any = {
    text: "",
    status: "",
    display: false
  }

  messageImage:any = {
    text:"",
    status: "",
    display: false
  }

  messageViews:any= {
    text:"",
    status: "",
    display: false
  }

  //change slug
  isEdittingSlug:any = false;
  tempSlug:any;

  //language
  actionSwitchLanguage: any;
  resSwitchLanguage: any;
  languageTabs:any = 'english';

  //image cropped
  data: any;
  cropperSettings: CropperSettings;
  nameFilePoster:any ="";
  imageExtension:any = "";
  edittingPoster:any = false;

  //image background
  dataBackground: any;
  cropperSettingsBackground: CropperSettings;
  nameFileBackground:any ="";
  imageExtensionBackground:any = "";
  edittingBackground:any = false;

  //ckeditor config
  ckeditorConfig:any = this.globalService.configCkEditor();


  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  @ViewChild('cropperBackground', undefined) cropperBackground:ImageCropperComponent;


  constructor(
    private videoService : VideoService,
    private globalService:GlobalService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    
    let $this = this;


    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res => {
      this.resSwitchLanguage = res;
    });
    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number
    });


    //get Video Detail
    this.videoService.getDetailPromise(this.id).subscribe(res=>{
      this.getDetailVideo(res[0],res[1],res[2]);
      // this.getListTags(res[1]);
      this.getListCategory(res[1]);
      this.getListPlaylist(res[2]);
      this.loading.detail = false;
    },error =>{
      this.message ={
        text: "Couldn't fetch the data.",
        status: "error",
        display: true
      }
      this.loading.detail = false;
      // setTimeout(function(){
        $this .router.navigate(["/video"]);
      // },1500);
    });


    //init crop image
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = environment.sizePoster.width;
    this.cropperSettings.height = environment.sizePoster.height;
    this.cropperSettings.croppedWidth = environment.sizePoster.width;
    this.cropperSettings.croppedHeight = environment.sizePoster.height;
    this.cropperSettings.canvasWidth = 250;
    this.cropperSettings.canvasHeight = 345;
    
    this.data = {};

    //init crop background
    this.cropperSettingsBackground = new CropperSettings();
    this.cropperSettingsBackground.noFileInput = true;
    this.cropperSettingsBackground.width = environment.sizeCoverPhoto.width ;
    this.cropperSettingsBackground.height =  environment.sizeCoverPhoto.height;
    this.cropperSettingsBackground.croppedWidth = environment.sizeCoverPhoto.width;
    this.cropperSettingsBackground.croppedHeight = environment.sizeCoverPhoto.height;
    this.cropperSettingsBackground.canvasWidth = 250;
    this.cropperSettingsBackground.canvasHeight = 300;

    this.dataBackground={};
  }

  id: number;
  private sub: any;

  ngOnInit() {
  }

  getDetailVideo(res,categories,playlist){
    let $this =this;
    this.videoDetail = res;

    //get view
    $this.videoDetail.views ="loading...";
    $this.videoService.getViewVideo($this.id).subscribe(res => {
      $this.videoDetail.views = res.view;
      $this.videoDetail.tempViews = res.view;
      $this.loading.views = false;
    }, err =>{
      $this.videoDetail.views = "-1";
      $this.videoDetail.tempViews = "-1";
      $this.messageViews ={
        text: "Couldn't fetch views.",
        status: "error",
        display: true
      }
      $this.loading.views = false;
    });

    //check slug if " " convert to ""
    if(this.videoDetail.slug == " "){
      this.videoDetail.slug ="";
    }

    //get current playlist to show playlist
    let currentPlaylist = _.find(playlist,function(value:any){
      return value.id == $this.videoDetail.playlistId;
    });

    //check playlist
    if(this.videoDetail.playlistId == "0") {
      this.videoDetail.playlistId = "" ;
    }else{
      if(typeof currentPlaylist != "undefined" && currentPlaylist){
        this.videoDetail.playlistId ={
          id:currentPlaylist.id,
          text:currentPlaylist.data.title.en
        }
      }else{
        this.videoDetail.playlistId ="";
      }
    }

    //check categories
    if(res.genres.length > 0){
      res.genres = _.map(res.genres , function(value){
        let categoryDetail:any = _.find(categories, function(item){
          return item['slug'] == value;
        });
        let newParam;
        if(typeof categoryDetail != "undefined" && categoryDetail){
          newParam = {
            id: categoryDetail.slug,
            text: categoryDetail.title.en
          }
        }else{
          newParam = {};
        }
        return newParam;
      });
    }
  };

  getListTags(res){
    this.listTags = (<any>_).map(res,function(value){
      let newValue = value.title;
      return newValue;
    });
  }

  getListCategory(res){
    this.listCategories = (<any>_).map(res,function(value){
      let newValue = {
        id: value.slug,
        text:value.title.en
      }
      return newValue;
    });
  }

  getListPlaylist(res){
    let $this = this;
    this.listPlaylist = (<any>_).map(res,function(value){
      //get playlist of this video
      if(value.id == $this.videoDetail.playlistId.id){
        $this.playlistWillRemoveVideo = value;
      }

      //new value for select2
      let newValue = {
        id: value.id,
        text: value.data.title.en
      };
      return newValue;
    });
    
    //update playlist will remove this video
    if(typeof $this.playlistWillRemoveVideo.data !== "undefined"){
      $this.playlistWillRemoveVideo.data.items = (<any>_).filter($this.playlistWillRemoveVideo.data.items , video =>{
        return video.id != $this.id;
      });
    }
  }



  updateVideo() {
    let $this = this;
    this.message.display = false;
    this.loading.detail = true;
    this.videoDetail.id = this.id;

    this.videoService.updateVideo(this.videoDetail).subscribe(res => {
      if(res.error){
        this.message ={
          text: "Slug already exists",
          status: "error",
          display: true
        }
        this.loading.detail = false;
        this.globalService.scrollTop();
        return false;
      }
      //update static HTML
      $this.videoService.generateStaticHTML(this.videoDetail.id).subscribe(resStaticHTML =>{

        $this.message ={
          text: "Update successfully",
          status: "success",
          display: true
        }

        $this.loading.detail = false;
        $this.globalService.scrollTop();
      },error =>{
        $this.message ={
          text: "Update staic HTML fail",
          status: "error",
          display: true
        }
        $this.loading.detail = false;
        $this.globalService.scrollTop();
      });
    },error =>{
      this.message ={
        text: "Slug already exists",
        status: "error",
        display: true
      }
      this.loading.detail = false;
      this.globalService.scrollTop();
    });
  }

  //------------------------------------upload Poster-----------------------------
  onPosterChange($event, type){
    this.messageImage.display = false;
    let $this = this;

    let file:File = $event.target.files[0];

    if( (file.size/1048576) > 2 ){
      this.messageImage ={
        text: "this file exceeds the maximum upload size for this site",
        status: "error",
        display: true,
        type: type
      }
      setTimeout(function(value){
        $this.edittingBackground = false;
        $this.edittingPoster = false;
      },0);
    }
    // //get base64
    this.getBase64(file,function(res){

      //split name
      let splitName = file.name + ".";
      let arraySplitName = splitName.split(".");

      if(type == "poster"){
        //get extension
        $this.imageExtension = arraySplitName[arraySplitName.length - 2];
        //get name
        for(let i=0 ; i < arraySplitName.length - 2; i++){
          if(i == 0){
            $this.nameFilePoster = arraySplitName[i];
          }else{
            $this.nameFilePoster =  $this.nameFilePoster + "." + arraySplitName[i];
          }
        };
      }
      if(type == "background"){
        //get extension
        $this.imageExtensionBackground = arraySplitName[arraySplitName.length - 2];
        //get name
        for(let i=0 ; i < arraySplitName.length - 2; i++){
          if(i == 0){
            $this.nameFileBackground = arraySplitName[i];
          }else{
            $this.nameFileBackground =  $this.nameFileBackground + "." + arraySplitName[i];
          }
        };
      }

      //put image into croped
      let image = new Image();
      image.src = res;
      (type == "poster") ? $this.cropper.setImage(image) : $this.cropperBackground.setImage(image);

      $("#changePoster").val("");
      $("#changeBackground").val("");
    })
  }
  onUploadPoster(type){

    //get image src
    let res = (type == 'poster') ? this.data.image : this.dataBackground.image;
    //show loading
    (type == 'poster') ? this.loading.poster = true : this.loading.background = true;

    //get base64
    let base64Name = res.split(",")[1];

    //init data uplad poster
    let newValue = {
      image: base64Name,
    };
    if(type== 'poster'){
      newValue['imageName'] = this.nameFilePoster +  String(Date.now());
      newValue['imageExtension'] = this.imageExtension;
    }
    if(type == 'background'){
      newValue['imageName'] = this.nameFileBackground +  String(Date.now());
      newValue['imageExtension'] = this.imageExtensionBackground;
    }

    //upload poster
    this.videoService.uploadImage(newValue).subscribe(res=>{
      let newLocation = this.globalService.changeDomainImage(res.data.Location);
      
      if(type == 'poster'){
        this.videoDetail.poster = newLocation;
        this.loading.poster = false;
        this.edittingPoster = false;
      }
      if(type == 'background'){
        this.videoDetail.backgroundImage = newLocation;
        this.loading.background = false;
        this.edittingBackground = false;
      }
    },error=>{
      console.log(error);
    });
  }

  
  changeHrefFacebookDebug(slug){
    var url =  environment.pathUrlFaceBook + "/video/" + slug + "/index.html" ;

    return "https://developers.facebook.com/tools/debug/og/object/?q=" + encodeURIComponent(url);
  }
  changeHrefFacebookDebug2(slug){
    var url =  environment.pathUrlFaceBook + "/video/" + slug ;

    return "https://developers.facebook.com/tools/debug/og/object/?q=" + encodeURIComponent(url);
  }
  onClickClearCloundFont(slug){
    this.message.display = false;
    this.loading.detail = true;
    this.videoService.clearCloundFont({
      slug:slug
    }).subscribe(res =>{
      setTimeout(() => {
        if(typeof res.Invalidation !== "undefined"){
            this.message ={
              text: "Clear cloudfront successfully",
              status: "success",
              display: true
            }
        }else{
          this.message ={
            text: "Clear cloudfront failed",
            status: "error",
            display: true
          }
        }
        this.loading.detail = false;
        this.globalService.scrollTop();
      }, environment.TimePendingCloudFront)
    },error =>{
      this.message ={
        text: "Clear cloudfront failed",
        status: "error",
        display: true
      }
      this.loading.detail = false;
      this.globalService.scrollTop();
    })
  }

  //-------------------------------change slug-------------------------
  slugValidate:any = true;
  onChangeSlug(){
    let hasUpperCaseReg = /[A-Z]/ ;
    let checkSlug = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
    if(checkSlug.test(this.videoDetail.slug) && !hasUpperCaseReg.test(this.videoDetail.slug)){
      this.slugValidate = true;
    }else{
      this.slugValidate = false;
    }
  }

  //------------------------------replace video---------------------------
  @ViewChild('myInput')
  myInputVariable: any;


  processing:any = "";
  file:any;
  fileName:any = "";
  typeFile:any = "";
  fileSelected:any = false;
  loadingUploadVideo:any = false;
  upload:any;

  uploadVideo:any = {
    title:""
  };

  //messageUploadVideo
  messageUploadVideo:any = {
    text: "",
    status: "",
    display: false
  }

  onClickOpenModal(){
    (<any>$('#replaceVideo')).modal({backdrop: 'static', keyboard: false});
    (<any>$("#replaceVideo")).modal("show");
  }

  fileChange(fileInput:any){;
    this.file = fileInput.target.files[0];
    this.fileName = this.file.name;
    this.typeFile = this.file.name.split(".")[this.file.name.split(".").length - 1];
    this.fileSelected = true;
  }
  
  onUploadVideo(){
    var $this = this;
    var AWSService:any = AWS;
    $this.loadingUploadVideo = true;
    $this.processing = "0%";
    $this.messageUploadVideo.display = false;

    AWSService.config.accessKeyId = environment.AwsAccessKeyId;

    AWSService.config.secretAccessKey = environment.AwsSecretAccessKey;

    AWSService.config.version = environment.AwsVersion;

    var bucket = new AWSService.S3({params: {Bucket: environment.AwsBucketName}});
    

    var params = {
      // Key: environment.pathUrlFolderBucket + "/" + slugVideo + $this.file.name, 
      Key: environment.pathUrlFolderBucket + "/edit_" + $this.id + "_" + $this.uploadVideo.title + "_" + Date.now() + "." + this.typeFile,  
      Body: $this.file,
      ContentType:"audio/mpeg",
      ACL:"public-read"};

    this.upload = bucket.upload(<any>params, function (err, data) {
      console.log(err,data);
      if(err){
        $this.messageUploadVideo ={
          text: "video Replace failed",
          status: "error",
          display: true
        } 
        $this.loadingUploadVideo = false;
        return false;
      }else{
        $this.messageUploadVideo ={
          text: "video Replace successfully",
          status: "success",
          display: true
        }
        $this.loadingUploadVideo = false;
      }
      $this.fileSelected = false;
      $this.reset();
    }).on('httpUploadProgress', function(evt:any) {
      $this.processing = +(evt["loaded"] * 100 / evt["total"] ).toFixed(2) + "%" ;
    }); 
  }

  onAbortUploadVideo(){
    if(this.upload){
      this.upload.abort();
    }
    this.messageUploadVideo.display = false;
    this.processing = "0%";
    this.fileSelected = false;
    this.myInputVariable.nativeElement.value ='' ;
    (<any>$("#replaceVideo")).modal("hide");
  }

  reset() {
    this.myInputVariable.nativeElement.value = "";
  }

  
  nameVideoValidate:any = true;
  onChangeNameVideo(){
    let hasUpperCaseReg = /[A-Z]/ ;
    let checkSlug = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
    if(checkSlug.test(this.uploadVideo.title)){
      this.nameVideoValidate = true;
    }else{
      this.nameVideoValidate = false;
    }
  }


  //------------------------------------delete video-------------------------
  playlistWillRemoveVideo:any = {};

  onDeleteVideo(){
    let $this = this;
    $this.loading.detail = true;
    (<any>$("#deleteVideo")).modal("hide");

    if($this.videoDetail.playlistId){
      
      $this.videoService.updatePlaylist($this.playlistWillRemoveVideo , $this.videoDetail).subscribe(res =>{

        $this.actionDeleteVideo();

      },error =>{
        $this.message ={
          text: "Delete Video failed",
          status: "error",
          display: true
        };
        $this.loading.detail = false;
        $this.globalService.scrollTop();
      });
    }else{
      $this.actionDeleteVideo();
    }
  }

  actionDeleteVideo(){
    let $this = this;
    var folder = this.videoDetail.video.split("/")[this.videoDetail.video.split("/").length - 2]
    var param ={
      "id": this.id,
      "folderName": folder
    }
    
    this.videoService.deleteVideo(param).subscribe(res =>{
      $this.router.navigate(["/video/list" ], {
        queryParams:{
          success: true,
          action: "delete"
        }
      } );
    },error =>{
      $this.message ={
        text: "Delete Video failed. But the video has been removed from the playlist",
        status: "error",
        display: true
      };
      $this.loading.detail = false;
      $this.globalService.scrollTop();
    });
  }

  onCloseDeleteVideo(){
    (<any>$("#deleteVideo")).modal("hide");
  }

  onOpenDeleteVideo(){
    (<any>$("#deleteVideo")).modal("show");
  }

  onChangeView(evt){
    if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57)
    {
      return false;
    }
  }
  onUpdateViews(){
    let $this = this;

    $this.loading.views = true;
    let newValue = {
      id:this.id,
      viewNumber: this.videoDetail.views
    }

    this.videoService.updateViewVideo(newValue).subscribe(res =>{
      $this.messageViews ={
        text: "Update views successfully",
        status: "success",
        display: true
      } 
      $this.loading.views = false;
    },err =>{
      $this.messageViews ={
        text: "Update views failed",
        status: "error",
        display: true
      };
      $this.loading.views = false;
    })
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


  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

