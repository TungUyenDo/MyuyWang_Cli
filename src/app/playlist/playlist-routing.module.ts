import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPlaylistComponent } from './list-playlist/list-playlist.component';
import { CreateUpdatePlaylistComponent } from './create-update-playlist/create-update-playlist.component';
import { PlaylistComponent } from './playlist.component'

const routes: Routes = [
  {path: '' , component: PlaylistComponent,
    children:[
        {path: '', redirectTo: 'list', pathMatch: 'full' },
        {path: "list" , component: ListPlaylistComponent},
        {path: "create" , component: CreateUpdatePlaylistComponent},
        {path: "edit/:id" , component: CreateUpdatePlaylistComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
