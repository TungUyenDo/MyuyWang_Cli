import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { CategoryComponent } from './category/category.component';
import { ListCategoryComponent } from './category/list/list.component';
import { EditCategoryComponent } from './category/create-edit/edit.component';

import { VideoComponent } from './video/video.component';
import { ListVideoComponent } from './video/list-video/list-video.component';
import { DetailVideoComponent } from './video/detail-video/detail-video.component';
import { UploadVideoComponent } from './video/upload-video/upload-video.component';


import { CreateUpdateArticleComponent } from './static-article/create-update-article/create-update-article.component';
import { ListArticleComponent } from './static-article/list-article/list-article.component';

import { DetailFaqComponent } from './faq/detail-faq/detail-faq.component';
import { ListFaqComponent } from './faq/list-faq/list-faq.component';
import { FaqComponent } from './faq/faq.component';

import {AuthGuard} from "./auth-guard.service";

const routes: Routes = [
	{
      path: 'login',
      component: LoginComponent,
  },
  {
      path: '',
      component: HomeComponent,
      canActivate:[AuthGuard],
      canActivateChild:[AuthGuard],
      children: [
          {path: "category" , component: CategoryComponent,
              children:[
                  {path: '', redirectTo: 'list', pathMatch: 'full' },
                  {path: "list" , component: ListCategoryComponent},
                  {path: "create" , component: EditCategoryComponent},
                  {path: "edit/:id" , component: EditCategoryComponent}
              ]
          },
          {
              path: "video", component: VideoComponent,
              children:[
                  {path: '', redirectTo: 'list', pathMatch: 'full'},

                  {path: "list" , component: ListVideoComponent},
                  {path: "edit/:id" , component: DetailVideoComponent},
                  {path: "upload" , component: UploadVideoComponent}
              ]
          },
          {path: "member", loadChildren: "./member-page/member-page.module#MemberPageModule"},
          {path: "banner", loadChildren: "./banner/banner.module#BannerModule"},
        //   {path: 'tag', loadChildren: "./tag/tag.module#TagModule"},
          {path: 'user', loadChildren: "./user/user.module#UserModule"},
          {path: "static-article" , component: CategoryComponent,
              children:[
                  {path: '', redirectTo: 'list', pathMatch: 'full' },
                  {path: "list" , component: ListArticleComponent},
                  // {path: "create" , component: CreateUpdateArticleComponent},
                  {path: "edit/:id" , component: CreateUpdateArticleComponent}
              ]
          },
          {path: "faq", component: FaqComponent, 
            children:[
                {path:'',redirectTo: 'list' ,pathMatch:'full'},
                {path: "list" , component: ListFaqComponent},
                {path: "create" , component: DetailFaqComponent},
                {path: "edit/:id",component: DetailFaqComponent}
            ]
          },
          {path: "playlist" , loadChildren: "./playlist/playlist.module#PlaylistModule" },
          {path: '', loadChildren: "./dashboard/dashboard.module#DashboardModule"}
      ]
  },
  { path: "**", redirectTo: '/'  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
