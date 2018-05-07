import { Component, OnInit } from '@angular/core';
import { FaqService } from '../faq.service';
import { Subject } from 'rxjs/Subject';
import { GlobalService} from '../../services/global.service';
import * as _ from "underscore";

@Component({
  selector: 'app-list-faq',
  templateUrl: './list-faq.component.html',
  styleUrls: ['./list-faq.component.scss']
})
export class ListFaqComponent implements OnInit {

  actionSwitchLanguage:any;
  resSwitchLanguage:any;

  listFAQ:any;
  selectedFAQ:any ={
    question:{
      en:"",
      cn:""
    }
  };
  dtTrigger: Subject<any> = new Subject();


  message:any = {
    text: "",
    status: "",
    display: false
  }

  loading:any = true;
  
  constructor(private faqService:FaqService,private globalService:GlobalService) { 
    //listen Event switch Language
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res =>{
      this.resSwitchLanguage = res;
    });

    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();

    this.faqService.getListFAQ().subscribe(res =>{
      this.listFAQ = res;

      this.loading = false;
      this.dtTrigger.next();
    });
  }

  onDelete(){
    this.loading = true;
    let $this = this;
    this.faqService.updateFAQ(false , false , $this.selectedFAQ.id).subscribe(res =>{
      $this.listFAQ.forEach( (element,key) => {
        if(element.id == $this.selectedFAQ.id){
          $this.listFAQ.splice(key,1);
        }
      });
      this.message ={
        text: "Delete successfully",
        status: "success",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
    },error =>{
      this.message ={
        text: "Delete failed",
        status: "error",
        display: true
      };
      this.loading = false;
      this.globalService.scrollTop(); 
    });
    (<any>$("#FAQ-modal")).modal("hide");
  }


  onOpenModal(item){
    this.selectedFAQ = item;
    (<any>$("#FAQ-modal")).modal();
  }


  ngOnInit() {
  }

}
