import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './mantenimiento/categorias/categorias.component';
import { CrearProductoComponent } from './mantenimiento/productos/crear-producto/crear-producto.component';
import { ProductosComponent } from './mantenimiento/productos/productos.component';
import { TallaComponent } from './mantenimiento/talla/talla.component';
import { CrearComponent } from './mantenimiento/usuarios/crear/crear.component';
import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PrincipalComponent } from './principal/principal.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'crearUsuario', component: CrearComponent },
  { path: 'productos/crear', component: CrearProductoComponent },
  { path: 'producto/:id', component: CrearProductoComponent },
  { path: 'tallas', component: TallaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
