import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import {  NoPageFoundComponent } from "./no-page-found/no-page-found.component";
import { PagesRoutingModule } from './pages/pages.routing';
const routes: Routes = [
  {path:'',redirectTo:'/principal',pathMatch:'full'},
  {path:'**',component:NoPageFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule//aca viene el router por eso hay que diferenciar el child con el contenedor
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
