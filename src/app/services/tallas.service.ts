import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class TallasService {

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
  crearTalla(body: any) {
    const url = `${api_url}/talla`
   return this.http.post(url, body, this.headers)
  }
  actualizarTalla(body: any, uid: string) {
    const url = `${api_url}/talla/${uid}`
    return this.http.put(url, body, this.headers)
  }
  actualizarEstadoTalla(estado: boolean, uid: string) {
    const url = `${api_url}/talla/estado/${uid}`
    return this.http.put(url, { estado: true }, this.headers)
  }
  listarTalla() {
    const url = `${api_url}/talla`
    return this.http.get(url, this.headers)
  }
  tallaxID(uid: string) {
    const url = `${api_url}/talla/${uid}`
    return this.http.get(url, this.headers)
  }
  eliminarTalla(uid:string){
    const url = `${api_url}/talla/${uid}`
    return this.http.delete(url, this.headers)
  }

}
