import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';
import * as AWS from 'aws-sdk';
import { ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalService} from '../../services/global.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})


export class UploadVideoComponent implements OnInit {
   
  @ViewChild('myInput')
  myInputVariable: any;


  processing:any = "";
  file:any;
  fileName:any = "";
  typeFile:any = "";
  fileSelected:any = false;
  loading:any = false;
  upload:any;

  uploadVideo:any = {
    title:""
  };

  //message
  message:any = {
    text: "",
    status: "",
    display: false
  }

  //language
  actionSwitchLanguage: any;
  resSwitchLanguage: any;
  languageTabs:any = 'english';
  
  fileChange(fileInput:any){;
    this.file = fileInput.target.files[0];
    console.log(this.file);
    this.fileName = this.file.name;
    this.typeFile = this.file.name.split(".")[this.file.name.split(".").length - 1];
    this.fileSelected = true;
  }

  constructor(private videoService:VideoService,
    private globalService:GlobalService,
    private router:Router) {
      this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res => {
        this.resSwitchLanguage = res;
      });
      //set default current language
      this.resSwitchLanguage = this.globalService.getCurrentLanguage();
  } 
  ngOnInit() {
  }
  onUploadVideo(){
    var $this = this;
    var AWSService:any = AWS;
    $this.loading = true;
    $this.processing = "0%";
    $this.message.display = false;

    AWSService.config.accessKeyId = environment.AwsAccessKeyId;

    AWSService.config.secretAccessKey = environment.AwsSecretAccessKey;

    AWSService.config.version = environment.AwsVersion;

    var bucket = new AWSService.S3({params: {Bucket: environment.AwsBucketName}});
    

    var params = {
      // Key: environment.pathUrlFolderBucket + "/" + slugVideo + $this.file.name, 
      Key: environment.pathUrlFolderBucket + "/" + "new_" + $this.uploadVideo.title + "_" + Date.now() + "." + this.typeFile,  
      Body: $this.file,
      ContentType:"audio/mpeg",
      ACL:"public-read"};

    this.upload = bucket.upload(<any>params, function (err, data) {
      console.log(err,data);
      if(err){
        $this.message ={
          text: "video Upload failed",
          status: "error",
          display: true
        } 
        $this.loading = false;
        return false;
      }else{
        $this.router.navigate(["/video/list" ], {
          queryParams:{
            success: true,
            action: "upload"
          }
        } );
      }
      $this.fileSelected = false;
      $this.reset();
    }).on('httpUploadProgress', function(evt:any) {
      $this.processing = +(evt["loaded"] * 100 / evt["total"] ).toFixed(2) + "%" ;
    }); 
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
}