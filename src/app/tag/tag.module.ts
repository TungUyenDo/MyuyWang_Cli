import { NgModule } from '@angular/core';
import {ListTagComponent} from "./list-tag/list-tag.component";
import {TagService} from "./tag.service";
import {RouterModule, Routes} from "@angular/router";

import {TagComponent} from "./tag.component";
import {ShareModule} from "../share/share.module";

const tagRoutes: Routes = [
  {path: "" , component: TagComponent, children:[
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {path: "list" , component: ListTagComponent},
    ]},
];

@NgModule({
  declarations: [
    TagComponent,
    ListTagComponent
  ],
  imports: [
    RouterModule.forChild(tagRoutes),
    ShareModule
  ],
  providers: [TagService],
  exports: [RouterModule]
})

export class TagModule { }
