import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticArticleService } from '../static-article.service';
import { GlobalService} from '../../services/global.service';
import * as _ from "underscore";

@Component({
  selector: 'app-create-update-article',
  templateUrl: './create-update-article.component.html',
  styleUrls: ['./create-update-article.component.scss']
})
export class CreateUpdateArticleComponent implements OnInit {

  constructor(private staticArticleService : StaticArticleService,
    private globalService:GlobalService,private route: ActivatedRoute) { 

    this.sub = this.route.params.subscribe(params => {
      this.id = String(+params['id']); // (+) converts string 'id' to a number

      if(typeof params['id'] != "undefined"){
        this.type = "edit"; 
      }
    });
  }

  loading:any = false;

  type:any = "create";
  id: any;
  sub: any;


  staticArticle: any = {
    title:{
      en: "",
      cn: ""
    },
    description:{
      en: "",
      cn: ""
    },
    id:""
  };

  message:any = {
    errorCreate: false,
    errorUpdate: false,
    success : false,
    updateSuccess: false
  }

  //languege tabs
  languageTabs:any = 'english';

  //config ckeditor
  configCkEditor:any = this.globalService.configCkEditor();



  ngOnInit() { 
    //get detail category if type == 'edit'
    if(this.type == "edit"){
      let $this = this;
      
      this.staticArticleService.getListStaticArticle().subscribe(res=>{
        this.staticArticle = _.find(res,function(value){
          return value.id == $this.id;
        })
      })
    }
  }

  onSubmit(){
    (this.type == "create") ? this.onCreateCategory() : this.onUpdateCategory();
  }

  onCreateCategory(){
    this.removeAllMessage();
    this.loading = true;
    let param = this.staticArticle;

    this.staticArticleService.createStaticArticle(param).subscribe(res =>{
      
      this.loading = false;
      this.message.success = true;
      this.globalService.scrollTop(); 

    },error =>{

      this.loading = false;
      this.message.errorCreate = true;
      this.globalService.scrollTop(); 
    });
  }

  onUpdateCategory(){
    this.removeAllMessage();
    this.loading = true;
    let param = this.staticArticle;
    param['id'] = this.id;
    param['action'] = 'update';
    this.staticArticleService.updateStaticArticle(param).subscribe(res =>{
      
      this.loading = false;
      this.message.updateSuccess = true;
      this.globalService.scrollTop(); 

    },error =>{

      this.loading = false;
      this.message.errorUpdate = true;
      this.globalService.scrollTop(); 
    });

  }

  //Destroy
  ngOnDestroy() {
    (this.sub) ? this.sub.unsubscribe() : "";
  }

   //remove all message
   removeAllMessage(){
    this.message = {
      errorUpdate: false,
      errorCreate: false,
      success : false,
      updateSuccess: false
    }
  }
}
