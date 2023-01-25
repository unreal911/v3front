import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }
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
    const url = `${api_url}/pedido/${uid}`
    return this.http.put(url, campo, this.headers)
  }
  cambiarEstado(uid: string, campo: any) {
    console.log(uid)
    const url = `${api_url}/pedido/estado/${uid}`
    return this.http.put(url, campo, this.headers)
  }
  cambiarPagado(uid: string, campo: any) {
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
    const url = `${api_url}/detallepedido/${uid}`
    return this.http.put(url, body, this.headers)
  }
}
