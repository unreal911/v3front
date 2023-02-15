import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class SliderService {

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
  crearSlider(body: any) {
    const url = `${api_url}/slider`
    return this.http.post(url, body, this.headers)
  }
  listarSlider() {
    const url = `${api_url}/slider`
    return this.http.get(url, this.headers)
  }
  editarSlider(uid: string, body: any) {
    const url = `${api_url}/slider/${uid}`
    return this.http.put(url, body, this.headers)
  }
  eliminarSlider(slider: any) {
    const url = `${api_url}/slider/${slider.uid}`
    return this.http.delete(url, this.headers)
  }
}
