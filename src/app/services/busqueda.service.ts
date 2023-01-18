import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(private http: HttpClient) {

  }
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
  busquedaColeccion(parametro: string, coleccion: 'usuarios' | 'productos' | 'categorias' | 'tallas') {
    const url = `${api_url}/busqueda/coleccion/${coleccion}/${parametro}`
    return this.http.get(url, this.headers)
  }
}
