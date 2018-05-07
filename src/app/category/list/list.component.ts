import { Component, OnInit ,OnDestroy , ViewChild} from '@angular/core';
import { CategoryService } from '../category.service';
import { GlobalService} from '../../services/global.service';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Router , ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListCategoryComponent implements OnInit {

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;

  actionSwitchLanguage:any;
  resSwitchLanguage:any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  loading:any = true;

  constructor(private categoryService : CategoryService,
  private globalService:GlobalService,private router:Router,
  private route:ActivatedRoute) {

    //listen Event switch Language
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res =>{
      this.resSwitchLanguage = res;
    });

    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();

  };


  //list category
  listCategory:any[];
  listVideos:any;
  listCount:any = [];

  ngOnInit() {
    let $this = this;
    

    this.categoryService.videoscategoryPromise().subscribe(res=>{
      this.listCategory = res[0];
      this.listVideos = res[1];

      //count video in category
      this.listVideos.forEach(element => {

        element = Object.assign($this.globalService.templateDataVideo() , element);

        if(element.genres.length >0){
          element.genres.forEach(category =>{
            
            if(typeof $this.listCount[category] === 'undefined'){
              $this.listCount[category] = 1;
            }else{
              $this.listCount[category] = $this.listCount[category] + 1;
            }
          });
        }
      });

      //add totalVidedo into list category
      this.listCategory.forEach(element =>{
        if(typeof $this.listCount[element.slug] !== 'undefined'){
          element['totalVideo'] =  $this.listCount[element.slug];
        }else{
          element['totalVideo'] = 0;
        }
      });

      //init datatable
      this.dtTrigger.next();

      //save page number
      $this.globalService.savePageNumberWhenChangePageDatatable($this.datatableElement , $this.route , $this.router , '/category/list');

      //remove loading
      this.loading = false;
    });
  }
  

  //remove listen event switch language
  ngOnDestroy() {
    (this.actionSwitchLanguage) ? this.actionSwitchLanguage.unsubscribe() : "";
  }

}
