import { Component, OnInit , OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../category.service';
import { GlobalService} from '../../services/global.service';
import * as _ from "underscore";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditCategoryComponent implements OnInit {
  type:any = "create";
  id: number;
  sub: any;

  constructor(private categoryService : CategoryService,
    private globalService:GlobalService,private route: ActivatedRoute) { }

  //list
  category: any = {
    title:{
      en: "",
      cn: ""
    },
    description:{
      en: "",
      cn: ""
    },
    slug:"",
    id:"",
    isActive:1
  };

  //message
  message:any = {
    slugExist: false,
    success : false,
    updateSuccess: false
  }

  //loading
  loading:any = false;

  //tabs
  languageTabs:any = 'english';


  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number

      if(typeof params['id'] != "undefined"){
        this.type = "edit"; 
      }
    });

    //get detail category if type == 'edit'
    if(this.type == "edit"){
      let $this = this;
      this.categoryService.getListCategory().subscribe(res=>{
        this.category = _.find(res,function(value){
          return value.id == $this.id;
        })
      })
    }
    console.log(this.type);
  }

  onSubmit(){
    (this.type == "create") ? this.onCreateCategory() : this.onUpdateCategory();
  }

  onCreateCategory(){
    this.loading = true;
    this.removeAllMessage();
    let $this = this;
    this.categoryService.createCategory(this.category).subscribe(res =>{
      if(res.status == false){
        this.message.slugExist = true;
        this.loading = false;
        this.globalService.scrollTop(); 
        return false;
      }

      this.message.success = true;
      this.loading = false;
      this.globalService.scrollTop(); 
    },error =>{

      this.loading = false;
      this.globalService.scrollTop(); 
    });
  }

  onUpdateCategory(){
    this.removeAllMessage();
    this.loading = true;
    let $this = this;
    console.log(this.category);
    this.categoryService.updateCategory(this.category).subscribe(res =>{
      if(res.status == false){
        this.message.slugExist = true;
        this.loading = false;
        this.globalService.scrollTop(); 
        return false;
      }

      this.message.updateSuccess = true;
      this.loading = false;
      this.globalService.scrollTop(); 
    },error =>{
      this.loading = false;
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
      slugExist: false,
      success : false,
      updateSuccess: false
    }
  }
}
