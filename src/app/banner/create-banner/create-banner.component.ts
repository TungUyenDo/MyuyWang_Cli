import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {BannerService} from "../banner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {GlobalService} from "../../services/global.service";

@Component({
  selector: 'create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.scss']
})
export class CreateBannerComponent implements OnInit {

  onSaveVariable = false;

  allowToCreateBanner = true;
  createBannerForm: FormGroup;
  croppedImage = false;
  edittingBanner;
  data: any;
  cropperSettings: CropperSettings;
  imageFile: File;
  err = false;

  messageImage:any = {
    text:"",
    status: "",
    display: false
  };

  loading: any = {
    title: false,
    type: false,
    image: false
  };

  languageTabs:any = 'english';
  listType:any = ["home", "category", "likedvideo", "search"];

  //ckeditor config
  ckeditorConfig:any = this.globalService.configCkEditor();

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(private bSvs: BannerService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private router: Router,
              private globalService: GlobalService) { }

  ngOnInit() {
    this.createBannerForm = new FormGroup({
      'link'    : new FormControl(' ', Validators.required),
      "type"    : new FormControl('home', Validators.required),
      "sortDesc": new FormControl('123', Validators.required),
      "order"   : new FormControl(0, Validators.required),
      "imageUrl": new FormControl(null, Validators.required),
      "title"   : new FormGroup({
        "en": new FormControl('' , Validators.required),
        "cn": new FormControl('')
      })
    });

    // this.createBannerForm.valueChanges.subscribe(
    //   res => {
    //     if (this.createBannerForm.valid && this.createBannerForm.value.imageUrl !== null)
    //       this.allowToCreateBanner = true
    //   }
    // );

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 960;
    this.cropperSettings.height = 363;
    this.cropperSettings.croppedWidth = 960;
    this.cropperSettings.croppedHeight = 363;
    this.cropperSettings.canvasWidth = 320;
    this.cropperSettings.canvasHeight = 121;

    this.data = {};
    this.loading.title = false;
    this.loading.type = false;
    this.loading.image = false;
  }

  fileChangeListener(event) {
    if (checkFileSize()) {
      this.messageImage.display = false;
      this.loading.image = true;
      this.err = false;
      let  image: any = new Image();
      this.imageFile = event.target.files;
      let reader: FileReader = new FileReader();

      if (this.imageFile && this.imageFile[0]) {
        reader.readAsDataURL(this.imageFile[0]);

        let that = this;
        reader.onloadend = function (loadEvent: any) {

          image.src = loadEvent.target.result;
          that.cropper.setImage(image);
          that.croppedImage = true;
          that.loading.image = false;
        }
      }

    } else {
      this.messageImage ={
        text: "this file exceeds the maximum upload size for this site",
        status: "error",
        display: true
      }
    }


    function checkFileSize() {
      let temp = calculateImageSize();
      switch (temp[1]) {
        case 'Bytes':break;
        case 'KB':break;
        case 'MB':
          if(temp[0] > 2) return false;
          break;
        case 'GB' : return false
      }
      return true
    }
    function calculateImageSize() {
      let size = event.target.files[0].size;
      let fSExt = ['Bytes', 'KB', 'MB', 'GB'];
      let i = 0;
      while (size > 900) {
        size/=1024;
        i++;
      }
      let exactSize = (Math.round(size*100)/100);
      return [exactSize, fSExt[i]];
    }

  }

  onSave() {
    if(this.createBannerForm.valid) {
      this.loading.image = true;
      if(this.createBannerForm.value.title.cn === '') this.createBannerForm.value.title.cn = this.createBannerForm.value.title.en 
      this.bSvs.createBanner(this.createBannerForm.value).subscribe(
        res => {
          this.router.navigate(['/banner']);
          this.loading.image = false
        }, error => console.log(error)
      );
    } else {
      this.onSaveVariable = true;
    }
  }

  onSaveCroppedImage() {
    this.loading.image = true;
    let image = this.data.image;
    image = image.slice(image.indexOf("base64") + 7, image.length);
    let that = this;

    let reader: FileReader = new FileReader();

    reader.readAsBinaryString(this.imageFile[0]);

    reader.onloadend = () => {
      this.bSvs.generateImageLinkFromBase64({
        "image": image,
        "imageName": that.imageFile[0].name.slice(0, that.imageFile[0].name.indexOf(".")),
        "imageExtension": that.imageFile[0].name.slice(that.imageFile[0].name.indexOf(".") + 1, that.imageFile[0].name.length)
      }).subscribe(res => {
          that.createBannerForm.patchValue({"imageUrl": this.globalService.changeDomainImage(res['data'].Location)});
          this.edittingBanner= true;
          this.err = false;
          this.loading.image = false;
          this.messageImage ={
            text: "Banner Image Upload Successfully",
            status: "success",
            display: true
          }
        },
        err => {
          this.err = true;
        }
      );
    }
  }
}

