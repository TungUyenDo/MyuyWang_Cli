import {Component, OnInit, ViewChild} from '@angular/core';
import {BannerService} from "../banner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {GlobalService} from "../../services/global.service";

@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.scss']
})
export class EditBannerComponent implements OnInit {
  languageTabs:any = 'english';
   editedBanner;
  listBanner;

  onSaveVariable = false;

  editedBannerForm: FormGroup;
  croppedImage = false;
  edittingBanner = true;
  data: any = {};
  cropperSettings: CropperSettings;
  imageFile: File;

  loading: any = {
    title: false,
    type: false,
    image: false
  };

  messageImage:any = {
    text:"",
    status: "",
    display: false
  };


  listType:any = ["home", "category", "likedvideo", "search"];
  listOrder:any = [];
  //ckeditor config
  ckeditorConfig:any = this.globalService.configCkEditor();

  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;

  constructor(private bSvs: BannerService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private router: Router,
              private globalService: GlobalService) { }

  ngOnInit() {
    this.loading.title = true;
    this.listBanner = this.bSvs.getListBanner();

    if(this.listBanner) {
      this.loading.title = false;
      let i = 0;
      this.listBanner.forEach(banner => {
        this.listOrder.push(i);
        i++
      });
      this.listBanner.forEach(banner => {
        if(banner.id === this.route.snapshot.params['id']) {
          this.editedBanner = banner;
          this.data.image = banner.imageUrl
        }
      })
    } else this.router.navigate(['/banner']);

    this.editedBannerForm = new FormGroup({
      'id'      : new FormControl(this.editedBanner.id),
      'link'    : new FormControl(this.editedBanner.link, Validators.required),
      "order"   : new FormControl(this.editedBanner.order || 0, Validators.required),
      "title"   : new FormGroup({
        "en": new FormControl(this.editedBanner.title.en , Validators.required),
        "cn": new FormControl(this.editedBanner.title.cn , Validators.required)
      }),
      "type"    : new FormControl(this.editedBanner.type  , Validators.required),
      "sortDesc": new FormControl(this.editedBanner.sortDesc),
      "imageUrl": new FormControl(this.editedBanner.imageUrl),
      "action"  : new FormControl("update")
    })


    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 960;
    this.cropperSettings.height = 363;
    this.cropperSettings.croppedWidth = 960;
    this.cropperSettings.croppedHeight = 363;
    this.cropperSettings.canvasWidth = 320;
    this.cropperSettings.canvasHeight = 121;
  }

  fileChangeListener(event) {
    if (checkFileSize()) {
      this.messageImage.display = false;
      this.loading.image = true;

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
    if (this.editedBannerForm.valid) {
      this.bSvs.updateBanner(this.editedBannerForm.value).subscribe(
        res => this.router.navigate(['/banner']),
        error => console.log(error)
      );
    } else {
      this.onSaveVariable = true;
    }
  }

  onSaveCroppedImage() {
    let image = this.data.image;
    image = image.slice(image.indexOf("base64") + 7, image.length);
    this.loading.image = true;
    let that = this;
    let reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.imageFile[0]);
    reader.onloadend = () =>
      this.bSvs.generateImageLinkFromBase64({
        "image": image,
        "imageName": that.imageFile[0].name.slice(0, that.imageFile[0].name.indexOf(".")),
        "imageExtension": that.imageFile[0].name.slice(that.imageFile[0].name.indexOf(".") + 1, that.imageFile[0].name.length)
      }).subscribe(res => {
          that.editedBannerForm.patchValue({"imageUrl": this.globalService.changeDomainImage(res['data'].Location)});
          this.loading.image = false;
          this.edittingBanner= true;
          this.messageImage ={
            text: "Banner Image Upload Successfully",
            status: "success",
            display: true
          }
        },
        err => {
          this.loading.image = false;
          this.messageImage ={
            text: "There is an error has occurred, please try again",
            status: "error",
            display: true
          }
        }
      );
  }


}
