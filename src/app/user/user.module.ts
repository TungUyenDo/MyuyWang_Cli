import { NgModule } from '@angular/core';
import {ShareModule} from "../share/share.module";
import {UserComponent} from "./user.component";
import {CreateUserComponent} from "./create-user/create-user.component";
import {RouterModule, Routes} from "@angular/router";
import {ListUserComponent} from "./list-user/list-user.component";
import {EditUserComponent} from "./edit-user/edit-user.component";
import {UserService} from "./user.service";

const userRoutes: Routes = [
  {path: "" , component: UserComponent, children:[
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {path: "list" , component: ListUserComponent},
      {path: "create" , component: CreateUserComponent},
      {path: "update-profile" , component: EditUserComponent}
    ]},
];

@NgModule({
  declarations: [
    UserComponent,
    ListUserComponent,
    CreateUserComponent,
    EditUserComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild(userRoutes)
  ],
  providers: [UserService],
  exports: [RouterModule]
})
export class UserModule { }
