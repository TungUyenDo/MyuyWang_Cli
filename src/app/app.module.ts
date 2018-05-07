import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CKEditorModule } from 'ng2-ckeditor';
import { ShareModule } from './share/share.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
import { SelectModule  } from 'ng2-select';
import {ImageCropperModule} from "ng2-img-cropper";


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';


//services
import { CategoryService } from './category/category.service';
import { VideoService } from './video/video.service';
import { StaticArticleService } from './static-article/static-article.service';
import { GlobalService } from './services/global.service';
import { CategoryComponent } from './category/category.component';
import { VideoComponent } from './video/video.component';
import { ListCategoryComponent } from './category/list/list.component';
import { EditCategoryComponent } from './category/create-edit/edit.component';

import { ListVideoComponent } from './video/list-video/list-video.component';
import { DetailVideoComponent } from './video/detail-video/detail-video.component';
import { StaticArticleComponent } from './static-article/static-article.component';
import { CreateUpdateArticleComponent } from './static-article/create-update-article/create-update-article.component';
import { ListArticleComponent } from './static-article/list-article/list-article.component';
import {AuthGuard} from "./auth-guard.service";
import { DetailFaqComponent } from './faq/detail-faq/detail-faq.component';
import { ListFaqComponent } from './faq/list-faq/list-faq.component';
import { FaqService } from './faq/faq.service';
import { FaqComponent } from './faq/faq.component';
import { UploadVideoComponent } from './video/upload-video/upload-video.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    SideBarComponent,
    LoginComponent,
    HomeComponent,
    CategoryComponent,
    VideoComponent,
    ListCategoryComponent,
    EditCategoryComponent,
    ListVideoComponent,
    DetailVideoComponent,
    StaticArticleComponent,
    CreateUpdateArticleComponent,
    ListArticleComponent,
    ListFaqComponent,
    DetailFaqComponent,
    FaqComponent,
    UploadVideoComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CKEditorModule,
    ShareModule,
    SelectModule,
    ImageCropperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    CategoryService,
    VideoService,
    GlobalService,
    StaticArticleService,
    FaqService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
