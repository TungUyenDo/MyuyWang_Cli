import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { GlobalService} from '../../services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  //test
  test:any = "";


  constructor(private translate: TranslateService,
  private globalService:GlobalService) {
    translate.setDefaultLang('en');
  };

  user:any = {
    firstName:"",
    lastName: ""
  }

  language:any = "en";

  ngOnInit() {
    if( !localStorage.getItem("translation") ){
      localStorage.setItem("translation", "en");
    }else{
      this.language = localStorage.getItem("translation");
      this.switchLanguage("en");
    }
    if(this.globalService.getCookie(environment.prefix+"-login")){
      this.user = JSON.parse( this.globalService.getCookie(environment.prefix+"-login") );
    }
  }

  onClickLogOut(){
    this.globalService.logOut();
  }

  switchLanguage(a) {
    localStorage.setItem("translation", this.language);
    this.translate.use(this.language);

    this.globalService.onSwitchLanguage(this.language);
  }

}
