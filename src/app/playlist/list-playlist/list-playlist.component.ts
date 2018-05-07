import { Component, OnInit , ViewChild} from '@angular/core';
import { PlaylistService } from '../playlist.service';
import { Subject } from 'rxjs/Subject';
import { GlobalService} from '../../services/global.service';
import * as _ from "underscore";
import { DataTableDirective } from 'angular-datatables';
import { Router , ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-list-playlist',
  templateUrl: './list-playlist.component.html',
  styleUrls: ['./list-playlist.component.scss']
})
export class ListPlaylistComponent implements OnInit {
  
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  //language
  actionSwitchLanguage:any;
  resSwitchLanguage:any;
  //list
  listPlaylist:any;
  dtTrigger: Subject<any> = new Subject();
  //playlist selected
  selectedPlaylist:any = {
    title: "",
  }

  //message
  message:any = {
    text: "",
    status: "",
    display: false
  }
  //loading
  loading:any = false;


  constructor(private playlistService:PlaylistService,
      private globalService:GlobalService,
      private router:Router,
      private route:ActivatedRoute) { 
    let $this = this;
    //listen Event switch Language
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res =>{
      this.resSwitchLanguage = res;
    });

    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();


    this.playlistService.getListPlaylist().subscribe((res:any) =>{
      this.listPlaylist = res;
      this.listPlaylist.forEach(element => {
        element['count'] = element.data.items.length;
      });
      

      this.dtTrigger.next();

      //save page number
      $this.globalService.savePageNumberWhenChangePageDatatable($this.datatableElement , $this.route , $this.router , '/playlist/list');
    });
   
  }

  ngOnInit() {
  }

}
