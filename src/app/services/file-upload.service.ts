import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

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
  cambiarPosicion(after: number, before: number, uid: string) {
    return this.http.put(`${api_url}/uploads/${uid}`,
      {
        after: after,
        before: before
      }
    )
  }
  subirArchivo(uid: string, file: any, coleccion: 'usuarios' | 'productos' | 'categorias') {
    const formData = new FormData()
    formData.append('img', file)
    const url = `${api_url}/uploads/${uid}`
    return this.http.post(url, formData, this.headers)
  }
  subirArchivoColeccion(uid: string, file: any, coleccion: 'usuarios' | 'productos' | 'categorias' | 'slider') {
    const formData = new FormData()
    formData.append('img', file)
    const url = `${api_url}/uploads/${coleccion}/${uid}`
    return this.http.post(url, formData, this.headers)
  }
  eliminarArchivo(uid: string, public_id: string) {
    const url = `${api_url}/uploads/${uid}`
    return this.http.delete(url, {
      body: {
        img: public_id
      },
      headers: {
        'x-token': this.token
      }
    })
  }
}
