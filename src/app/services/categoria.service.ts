import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Categoria, listarCategoria } from '../interfaces/rpt.listar.categorias';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }

  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
  }
  listarCategoria(desde: number, hasta: number) {
    const url = `${api_url}/categoria/listar/${desde}/${hasta}`
    return this.http.get<listarCategoria>(url, this.headers)
  }
  ActualizarCategoria(categoria:Categoria){
    const url = `${api_url}/categoria/${categoria._id}`
    return this.http.put(url,{nombre:categoria.nombre},this.headers)
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
}
