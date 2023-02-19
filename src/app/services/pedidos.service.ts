import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioService } from './usuario.service';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(
    private http: HttpClient,
    private usuarioSevice:UsuarioService
    ) { }
  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }
  listarPedidos(desde: number, limite: number) {
    const url = `${api_url}/pedido/listarPedidos/${desde}/${limite}`
    return this.http.get(url, this.headers)
  }
  actualizarPedido(uid: string, campo: any) {
    campo.usuario=this.usuarioSevice.usuario.uid
    console.log(campo)
    const url = `${api_url}/pedido/${uid}`
    return this.http.put(url, campo, this.headers)
  }
  cambiarEstado(uid: string, campo: any) {
    console.log(uid)
    campo.usuario=this.usuarioSevice.usuario.uid
    const url = `${api_url}/pedido/estado/${uid}`
    return this.http.put(url, campo, this.headers)
  }
  cambiarPagado(uid: string, campo: any) {
    console.log(this.usuarioSevice.usuario.uid)
    campo.usuario=this.usuarioSevice.usuario.uid
    const url = `${api_url}/pedido/pagado/${uid}`
    return this.http.put(url, campo, this.headers)
  }
  eliminar(uid: string) {
    const url = `${api_url}/pedido/${uid}`
    return this.http.delete(url, this.headers)
  }
  PedidoID(uid: string) {
    const url = `${api_url}/pedido/${uid}`
    return this.http.get(url, this.headers)
  }
  listarDetallePorPedido(uid: string, desde: number, limite: number) {
    const url = `${api_url}/detallepedido/listar/${uid}/${desde}/${limite}`
    return this.http.get(url, this.headers)
  }
  editarDetallePedido(uid: string, body: any) {
    body.usuario=this.usuarioSevice.usuario.uid
    const url = `${api_url}/detallepedido/${uid}`
    return this.http.put(url, body, this.headers)
  }
  crearVentaPedido(body: any) {
    body.usuario=this.usuarioSevice.usuario.uid
    const url = `${api_url}/pedido`
    return this.http.post(url, body, this.headers).pipe(

    )
  }
  crearDetalleVentaPedido(body: any) {
    body.usuario=this.usuarioSevice.usuario.uid
    const url = `${api_url}/detallepedido`
    return this.http.post(url, body, this.headers)
  }
  crearDetalleVentaPedidoP(body: any) {
    body.usuario=this.usuarioSevice.usuario.uid
    const url = `${api_url}/detallepedido/dventa`
    return this.http.post(url, body, this.headers)
  }
}
