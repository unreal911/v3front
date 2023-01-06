import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PrincipalComponent } from './principal/principal.component';
import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { CategoriasComponent } from './mantenimiento/categorias/categorias.component';
import { ProductosComponent } from './mantenimiento/productos/productos.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from './perfil/perfil.component';
import { CrearComponent } from './mantenimiento/usuarios/crear/crear.component';



@NgModule({
  declarations: [
    PrincipalComponent,
    UsuariosComponent,
    CategoriasComponent,
    ProductosComponent,
    PagesComponent,
    PerfilComponent,
    CrearComponent,

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PrincipalComponent,
    UsuariosComponent,
    CategoriasComponent,
    ProductosComponent,
    PagesComponent
  ]
})
export class PagesModule { }