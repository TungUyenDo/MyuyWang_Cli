import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MemberPageComponent} from "./member-page.component";
import {ListMemberComponent} from "./list-member/list-member.component";
import {MemberPageService} from "./member-page.service";
import {ShareModule} from "../share/share.module";
import {RouterModule, Routes} from "@angular/router";

const Member_Page_Routes: Routes = [
  {path: "" , component: MemberPageComponent, children:[
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {path: "list" , component: ListMemberComponent}
    ]},
]

@NgModule({
  declarations: [
    MemberPageComponent,
    ListMemberComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    RouterModule.forChild(Member_Page_Routes)
  ],
  providers: [MemberPageService],
  exports: [RouterModule]
})
export class MemberPageModule { }
