import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ListarProducto, ProductoID } from '../interfaces/rpt.listarProducto';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http:HttpClient) { }
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
  ProductoId(uid:string){
    const url = `${api_url}/producto/id/${uid}`
    return this.http.get<ProductoID>(url,this.headers)
  }
}
