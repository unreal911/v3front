import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './mantenimiento/categorias/categorias.component';
import { DetallePedidoComponent } from './mantenimiento/pedido/detalle-pedido/detalle-pedido.component';
import { PedidoComponent } from './mantenimiento/pedido/pedido.component';
import { CrearProductoComponent } from './mantenimiento/productos/crear-producto/crear-producto.component';
import { ProductosComponent } from './mantenimiento/productos/productos.component';
import { SliderComponent } from './mantenimiento/slider/slider.component';
import { TallaComponent } from './mantenimiento/talla/talla.component';
import { CrearComponent } from './mantenimiento/usuarios/crear/crear.component';
import { UsuariosComponent } from './mantenimiento/usuarios/usuarios.component';
import { VentaComponent } from './mantenimiento/venta/venta.component';
import { PerfilComponent } from './perfil/perfil.component';
import { PrincipalComponent } from './principal/principal.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'principal', component: PrincipalComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'crearUsuario', component: CrearComponent },
  { path: 'productos/crear', component: CrearProductoComponent },
  { path: 'producto/:id', component: CrearProductoComponent },
  { path: 'tallas', component: TallaComponent },
  { path: 'pedidos', component: PedidoComponent },
  { path: 'detallePedido/:id', component: DetallePedidoComponent },
  { path: 'venta', component: VentaComponent },
  { path: 'slider', component: SliderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
