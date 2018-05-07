import {Component, OnInit, ViewChild , OnDestroy} from '@angular/core';
import {BannerService} from "../banner.service";
import {Subject} from "rxjs/Subject";
import {DataTableDirective} from "angular-datatables";
import * as _ from "underscore";
import {GlobalService} from "../../services/global.service";
import {VideoService} from "../../video/video.service";
import { Router , ActivatedRoute } from "@angular/router";

@Component({
  selector: 'list-banner',
  templateUrl: './list-banner.component.html',
  styleUrls: ['./list-banner.component.scss']
})
export class ListBannerComponent implements OnInit {
  selectedBanner;
  //language
  actionSwitchLanguage: any;
  resSwitchLanguage: any;

  constructor(private bSvs : BannerService,
              private videoService : VideoService,
              private globalService: GlobalService,
              private router:Router,
              private route:ActivatedRoute)
  {
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res => {
      this.resSwitchLanguage = res;
    });
    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();
  }

  listBanner;

  @ViewChild(DataTableDirective) datatableElement: DataTableDirective;

  //filter
  filterType:any = 'all';

  //list

  listType:any = ["home", "category", "likedvideo", "search"];

  //loading
  loading:any = true;



  dtTrigger: Subject<any> = new Subject();

  lang:string = '';

  ngOnInit() {
    this.bSvs.getListBannerFromAPI().subscribe(
      res => {
        let $this = this;
        this.loading = false;
        this.listBanner = this.bSvs.getListBanner();

        this.dtTrigger.next();

        //save page number
        $this.globalService.savePageNumberWhenChangePageDatatable($this.datatableElement , $this.route , $this.router , '/banner/list');

        $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
          let existType = false;

          if($this.filterType == 'all'){
            return true;
          }
          if($this.listBanner[dataIndex].type == $this.filterType){
            existType = true;
          }

          return existType;
        });
      });


  }

  onDeleteBanner(banner) {
    this.bSvs.deleteBanner(banner.id).subscribe(
      res => this.listBanner.splice(this.listBanner.indexOf(banner), 1),
      err => console.log(err)
    )
  }

  onChangeFilterType(e){
    //reRender table
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {

      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngOnDestroy() {
    $.fn['dataTable'].ext.search.pop();
  }


}
