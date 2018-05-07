import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BannerComponent} from "./banner.component";
import {BannerService} from "./banner.service";
import {ListBannerComponent} from "./list-banner/list-banner.component";
import { EditBannerComponent } from './edit-banner/edit-banner.component';
import {ReactiveFormsModule} from "@angular/forms";
import { CreateBannerComponent } from './create-banner/create-banner.component';
import {ShareModule} from "../share/share.module";
import {ImageCropperModule} from "ng2-img-cropper";
import {RouterModule, Routes} from "@angular/router";

const Banner_Routes: Routes = [
  {path: "" , component: BannerComponent, children:[
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {path: "list" , component: ListBannerComponent},
      {path: "create" , component: CreateBannerComponent},
      {path: "edit/:id" , component: EditBannerComponent}
    ]},
];

@NgModule({
  declarations: [
    BannerComponent,
    ListBannerComponent,
    EditBannerComponent,
    CreateBannerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShareModule,
    ImageCropperModule,
    RouterModule.forChild(Banner_Routes)
  ],
  providers: [BannerService],
  exports: [RouterModule]
})
export class BannerModule { }
