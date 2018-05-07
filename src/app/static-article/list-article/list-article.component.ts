import { Component, OnInit } from '@angular/core';
import {StaticArticleService} from '../static-article.service';
import { Subject } from 'rxjs/Subject';
import { GlobalService} from '../../services/global.service';
import * as _ from "underscore";

@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.scss']
})
export class ListArticleComponent implements OnInit {

  actionSwitchLanguage:any;
  resSwitchLanguage:any;
  
  listStaticArticle:any;
  dtTrigger: Subject<any> = new Subject();

  selectedArticle:any = {
    title: "",
  }

  message:any = {
    text: "",
    status: "",
    display: false
  }

  loading:any = false;

  constructor(private staticArticleService:StaticArticleService,private globalService:GlobalService) { 
    //listen Event switch Language
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res =>{
      this.resSwitchLanguage = res;
    });

    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();


    this.staticArticleService.getListStaticArticle().subscribe((res) =>{
      this.listStaticArticle = res;
      let $this = this;

      _.each(this.listStaticArticle, function(value){
        value['createddAt'] = $this.globalService.formatDate(value['createdAt']);
        value['updatedAt'] = $this.globalService.formatDate(value['updatedAt']); 
      });
      console.log(this.listStaticArticle);

      this.dtTrigger.next();
    })

  }

  ngOnInit() {
  }

  // onDeleteStaticArticle(){
  //   this.loading = true;
  //   this.message.display = false;
  //   let param = {
  //     id: this.selectedArticle.id,
  //     action: "delete"
  //   } 
  //   this.staticArticleService.deleteStaticArticle(param).subscribe(res =>{
  //     this.message = {
  //       text: "Static Article delete successfully",
  //       status: "success",
  //       display: true
  //     }
  //     this.loading = false;
  //     let itemDeleted = _.find(this.listStaticArticle,function(value:any){
  //       return value.id == param.id;
  //     });
  //     this.listStaticArticle.splice(this.listStaticArticle.indexOf(itemDeleted),1);
  //   },error => {
  //     this.message = {
  //       text: "Static Article delete failed",
  //       status: "fail",
  //       display: true
  //     };
  //     this.loading = false;
  //   });
  //   (<any>$("#static-article-modal")).modal("hide");
  // }

  onOpenModal(item){
    this.selectedArticle = item;
    console.log(item);
    (<any>$("#static-article-modal")).modal();
  }

}
