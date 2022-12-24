import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PrincipalComponent } from './principal/principal.component';
import { UsuariosComponent } from './matenimiento/usuarios/usuarios.component';
import { CategoriasComponent } from './matenimiento/categorias/categorias.component';
import { ProductosComponent } from './matenimiento/productos/productos.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PrincipalComponent,
    UsuariosComponent,
    CategoriasComponent,
    ProductosComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    RouterModule
  ],
  exports:[
    PrincipalComponent,
    UsuariosComponent,
    CategoriasComponent,
    ProductosComponent,
    PagesComponent
  ]
})
export class PagesModule { }
