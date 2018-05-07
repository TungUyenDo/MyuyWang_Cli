import { Component, OnInit , ViewChild , OnDestroy } from '@angular/core';
import { VideoService } from '../video.service';
import { Subject } from 'rxjs/Subject';
import { GlobalService} from '../../services/global.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';
import { Router , ActivatedRoute } from "@angular/router";
import * as _ from "underscore";

@Component({
  selector: 'app-list-video',
  templateUrl: './list-video.component.html',
  styleUrls: ['./list-video.component.scss']
})
export class ListVideoComponent implements OnInit {

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  pathUrlFrontEnd:any = environment.pathUrlFrontEnd;

  //filter
  filterCategories:any = 'all';
  filterTags:any = 'all';
  filterType:any = 'all';
  filterStatus:any = 'all';
  filterProcessingStatus:any = 'all';

  //list
  listTags:any;
  listCategories:any;
  listVideo:any;

  //loading
  loading:any = true;

  //language
  actionSwitchLanguage: any;
  resSwitchLanguage: any;

  //destroy
  private videoServiceSubscribe;

  //time stamp
  timestamp:any = Date.now();

  //message
  message:any = {
    text: "",
    status: "",
    display: false
  }


  constructor(
    private videoService : VideoService,
    private globalService:GlobalService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res => {
      this.resSwitchLanguage = res;
    });
    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();

    let $this = this;
    let successParam = this.route.snapshot.queryParamMap.get("success");
    let actionParam = this.route.snapshot.queryParamMap.get("action");
    if(successParam && actionParam){
      switch(actionParam){
        case "upload":
          $this.message = {
            text: "video Upload successfully",
            status: "success",
            display: true
          }
          break;
        case "delete":
          $this.message ={
            text: "Delete video successfully",
            status: "success",
            display: true
          } 
          break;
        default:
          break;
      }
    }
    this.globalService.scrollTop();
    let url = this.router.url + "?";
    if(url.split("?").length >  2){
      url= this.router.url.substring(0, this.router.url.indexOf("?"));
      this.router.navigateByUrl(url);
    }
    
  }

  dtTrigger: Subject<any> = new Subject();

  lang:string = '';

  ngOnInit() {
    this.videoServiceSubscribe = this.videoService.getListVideoPromise().subscribe((res) => {
      let $this = this;
      this.loading = false;
      this.listVideo = res[0];
      this.listCategories = res[1];


      this.listVideo = this.listVideo.sort(function(a , b){
        return b.createdAt - a.createdAt ;
      });
      
      (<any>_).each(this.listVideo,function(value , key){
        $this.listVideo[key].views = "loading...";

        $this.videoService.getViewVideo($this.listVideo[key].id).subscribe(res => {
          $this.listVideo[key].views = res.view;
        }, err =>{
          $this.listVideo[key].views = "-1"
        });
  
        var templateData = Object.assign({}, $this.globalService.templateDataVideo());

        $this.listVideo[key] = Object.assign(templateData , value);

        //format date
        $this.listVideo[key].updatedAt = $this.globalService.formatDate(value.updatedAt);
        $this.listVideo[key].createdAt = $this.globalService.formatDate(value.createdAt);

        //convert name category
        $this.listVideo[key].genres.forEach(function(genre , index){
          $this.listVideo[key].genres[index] = _.find($this.listCategories,function(category){
            return genre == category.slug;
          });
          if(typeof  $this.listVideo[key].genres[index] == 'undefined'){
            $this.listVideo[key].genres[index] = {
              title:{
                en:"",
                cn:""
              },
              slug:""
            }
          }
        });
      });

      this.dtTrigger.next();

      //save page number
      this.globalService.savePageNumberWhenChangePageDatatable(this.datatableElement , this.route , this.router , '/video/list');


      $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
        let existCategory = false;
        let existTag = false;
        let existType = false;
        let existStatus = false;
        let existProcessingStatus = false;

        if($this.filterCategories == 'all' && $this.filterTags == 'all' && $this.filterStatus == 'all' && $this.filterType == 'all' && $this.filterProcessingStatus == 'all'){
          return true;
        };

        ($this.filterCategories == 'all') ? existCategory = true : "";
        ($this.filterTags == 'all') ? existTag = true : "";
        ($this.filterStatus == 'all') ? existStatus = true : "";
        ($this.filterType == 'all') ? existType = true : "";
        ($this.filterProcessingStatus == 'all') ? existProcessingStatus = true : "";

        $this.listVideo[dataIndex].genres.forEach(function(value ,key){
          ($this.filterCategories ==  value.slug) ? existCategory = true :"";
        });
        $this.listVideo[dataIndex].tags.forEach(function(value,key){
          ($this.filterTags == value) ? existTag = true : "";
        });
        ($this.listVideo[dataIndex].isPrivate == $this.filterType) ? existType = true : "";
        ($this.listVideo[dataIndex].status == $this.filterStatus) ? existStatus = true : "";
        ($this.filterProcessingStatus == true && $this.listVideo[dataIndex].slug != " ") ? existProcessingStatus = true : "";
        ($this.filterProcessingStatus == false && $this.listVideo[dataIndex].slug == " ") ? existProcessingStatus = true : "";


        // $this.listVideo[dataIndex].genres.forEach(function(value ,key){
        //   if($this.filterCategories == 'all' || $this.filterCategories ==  value.slug){ existCategory = true }
        // });
        // $this.listVideo[dataIndex].tags.forEach(function(value,key){
        //   if($this.filterTags == 'all' || $this.filterTags == value){ existTag = true;}
        // });

        return (existCategory && existTag && existStatus && existType && existProcessingStatus) ? true : false ;
      });
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

  onChangeFilterCategories(e){
    //reRender table
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {

      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  onClickClearCloundFont(slug){
    this.message.display = false;
    this.loading = true;
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
        this.loading = false;
        this.globalService.scrollTop();
      }, environment.TimePendingCloudFront)
    },error =>{
      this.message ={
        text: "Clear cloudfront failed",
        status: "error",
        display: true
      }
      this.loading = false;
      this.globalService.scrollTop();
    })
  }

  ngOnDestroy() {
    $.fn['dataTable'].ext.search.pop();
  }

}
