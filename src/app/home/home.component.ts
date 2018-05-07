import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalService} from '../services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() {};


  ngOnInit() {
  }

}
