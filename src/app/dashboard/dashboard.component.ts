import { Component, OnInit } from '@angular/core';
import {DashboardService} from "./dashboard.service";
import * as moment from "moment";
import {GlobalService} from "../services/global.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  recentLoginMember = [];
  recentAddedVideo = [];
  actionSwitchLanguage: any;
  resSwitchLanguage: any;

  private listMember;


  // Social
  public socialDoughnutChartLabels:string[] = ['Facebook', 'Google'];
  public socialDoughnutChartData:number[] = [];
  public socialDoughnutChartType:string = 'doughnut';
  public socialDoughnutChartColors: any[] = [
    {
      backgroundColor:["#3b5999", "#d62d20", "#FAFFF2", "#FFFCC4", "#B9E8E0"]
    }];

  // Total Video
  public videoDoughnutChartLabels:string[] = ['Active', 'Inactive'];
  public videoDoughnutChartData:number[] = [];
  public videoDoughnutChartType:string = 'doughnut';
  public videoDoughnutChartColors: any[] = [{backgroundColor:["green", "gray"]}];
  public totalVideo = 0;
  public activeVideo = 0;


  constructor(private dSvs: DashboardService,
              private globalService: GlobalService) {
    this.actionSwitchLanguage = this.globalService.resSwithLanguage.subscribe(res => {
      this.resSwitchLanguage = res;
    });
    //set default current language
    this.resSwitchLanguage = this.globalService.getCurrentLanguage();
  }


  ngOnInit() {
    let $this =this;
    this.dSvs.getListMember().subscribe(member => {
      this.listMember = member;

      this.recentLoginMember = get8RecentLoginMember(sortListDesc(this.listMember));

      this.socialDoughnutChartData = getSocialUsage(this.listMember);

      // Calculate Recent Login Member

      function sortListDesc(list) {
        list.sort((a, b) => {
          a.loginAtModified = moment(a.loginAt, 'x').format("DD/MM/YYYY HH:mm:ss");
          b.loginAtModified = moment(b.loginAt, 'x').format("DD/MM/YYYY HH:mm:ss");
          return b.loginAtModified - a.loginAtModified
        });
        return list
      }
      function get8RecentLoginMember(list){
        let temp = [];
        for(let i = 0; (list.length > 8) ? i < 8 : i < list.length; i++) {
          list[i].loginAt = moment(list[i].loginAt, 'x').format("DD/MM/YYYY HH:mm:ss");
          temp.push(list[i]);
        }
        return temp
      }

      //Social Usage

      function getSocialUsage(list) {
        let fb = 0, gg = 0;
        list.forEach(data=>
          (data.loginType === 'facebook')
            ? fb += 1
            : gg += 1
        );
        return [fb, gg];
      }
    });

    this.dSvs.getListVideo().subscribe(video => {
      this.totalVideo = Object.keys(video).length;

      let temp = Object.keys(video).map(function(index){
        let person = Object.assign($this.globalService.templateDataVideo(), video[index] );
        // do something with person
        return person;
      });

      this.recentAddedVideo = get6RecentAddedVideo(sortListDesc(temp));


      let tempArray = Object.keys(video).map(function(index){
        let person = video[index].status;
        return person;
      });

      tempArray.forEach(video => {
        if (video === true) this.activeVideo +=1
      });

      this.videoDoughnutChartData = [this.activeVideo, this.totalVideo - this.activeVideo];

      function sortListDesc(list) {
        list.sort((a, b) => {
          a.createdAtModified = moment(a.createdAt, 'x').format("DD/MM/YYYY HH:mm:ss");
          b.createdAtModified = moment(b.createdAt, 'x').format("DD/MM/YYYY HH:mm:ss");
          return b.createdAtModified - a.createdAtModified
        });
        return list
      }
      function get6RecentAddedVideo(list){
        let temp = [];
        for(let i = 0; (list.length > 6) ? i < 6 : i < list.length; i++) {
            list[i].createdAt = moment(list[i].createdAt, 'x').format("DD/MM/YYYY HH:mm:ss");
            temp.push(list[i]);
        }
        return temp
      }
    })
  }




  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
}
