import { Component, OnInit , OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaqService } from '../faq.service';
import { GlobalService} from '../../services/global.service';
import * as _ from "underscore";

@Component({
  selector: 'app-detail-faq',
  templateUrl: './detail-faq.component.html',
  styleUrls: ['./detail-faq.component.scss']
})
export class DetailFaqComponent implements OnInit {

  faq:any = {
    question:{
      en:"",
      cn:""
    },
    answer:{
      en:"",
      cn:""
    }
  }

  //language
  actionSwitchLanguage: any;
  resSwitchLanguage: any;
  languageTabs:any = 'english';

  //loading
  loading:any = false;

  //message
  message:any = {
    text: "",
    status: "",
    display: false
  }

  //config ckeditor
  configCkEditor:any = this.globalService.configCkEditor();

  type:any = "create";
  id: number;
  sub: any;
  
  constructor(
    private faqService : FaqService,
    private globalService:GlobalService,
    private route: ActivatedRoute
  ) { 
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res => {
      this.resSwitchLanguage = res;
    });
    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']; // (+) converts string 'id' to a number

      if(typeof params['id'] != "undefined"){
        this.type = "edit"; 
      }
    });

    if(this.type == "edit"){
      let $this = this;
      this.faqService.getListFAQ().subscribe(res=>{
        this.faq = _.find(res,function(value){
          return value.id == $this.id;
        });
        
      })
    }
  }

  onSubmit(){
    this.loading = true;
    if(this.type == "create"){
      this.onCreate();
    }
    if(this.type == "edit"){
      this.onUpdate();
    }
  }

  onCreate(){
    this.faqService.updateFAQ(this.faq , this.type , false).subscribe(res =>{
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
  onUpdate(){
    this.faqService.updateFAQ(this.faq , this.type , this.id).subscribe(res =>{
      this.message ={
        text: "Update successfully",
        status: "success",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
    },error =>{
      this.message ={
        text: "Update failed",
        status: "error",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
    });
  }
  
  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
