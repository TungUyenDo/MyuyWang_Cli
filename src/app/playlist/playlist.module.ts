import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistRoutingModule } from './playlist-routing.module';

import {PlaylistComponent} from './playlist.component';
import {CreateUpdatePlaylistComponent} from './create-update-playlist/create-update-playlist.component';
import {ListPlaylistComponent} from './list-playlist/list-playlist.component';

import {ShareModule} from '../share/share.module';

import {PlaylistService} from "./playlist.service";
import {ImageCropperModule} from "ng2-img-cropper";

@NgModule({
  imports: [
    CommonModule,
    PlaylistRoutingModule,
    ShareModule,
    ImageCropperModule
  ],
  providers:[
    PlaylistService
  ],
  declarations: [
    ListPlaylistComponent,
    CreateUpdatePlaylistComponent,
    PlaylistComponent
  ]
})
export class PlaylistModule { }
