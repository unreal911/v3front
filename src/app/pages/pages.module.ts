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
import { ComponentsModule } from '../components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { CrearProductoComponent } from './mantenimiento/productos/crear-producto/crear-producto.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { PipesModule } from '../pipes/pipes.module';
import { MantenimientoComponent } from './mantenimiento/mantenimiento.component';
import { TallaComponent } from './mantenimiento/talla/talla.component';

@NgModule({
  declarations: [
    PrincipalComponent,
    UsuariosComponent,
    CategoriasComponent,
    ProductosComponent,
    PagesComponent,
    PerfilComponent,
    CrearComponent,
    CrearProductoComponent,
    MantenimientoComponent,
    TallaComponent,

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    DragDropModule,
    MatListModule,
    PipesModule
  ],
  exports: [
    PrincipalComponent,
    UsuariosComponent,
    CategoriasComponent,
    ProductosComponent,
    PagesComponent,


  ]
})
export class PagesModule { }
