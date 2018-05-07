import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

//service
import { ApiService } from '../services/api.service';
import { GlobalService } from '../services/global.service';

//module
import { DataTablesModule } from 'angular-datatables';
import {ChartsModule} from "ng2-charts";
import {CKEditorModule} from "ng2-ckeditor";
import {SelectModule} from "ng2-select";


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ChartsModule,
    CKEditorModule,
    SelectModule
  ],
  providers:[
    ApiService,
    GlobalService,
  ],
  declarations: [
  ],
  exports:[
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    ChartsModule,
    CKEditorModule,
    SelectModule
  ]
})
export class ShareModule { }
