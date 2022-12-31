import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { login } from '../interfaces/login.interfase';
import { registerInterface } from '../interfaces/register.interface';
import { Login } from '../interfaces/rpt.login.interface';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuario: any
  constructor(private http: HttpClient, private router: Router) { }
  guardarLocalStorage(token: string) {
    localStorage.setItem('token', token);
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
  crearusuario(body: registerInterface) {
    const url = `${api_url}/usuario`
    return this.http.post(url, body, this.headers)
  }
  login(body: login) {
    const url = `${api_url}/auth/login`
    return this.http.post<Login>(url, body).pipe(
      tap(
        (resp) => {
          localStorage.setItem('token', resp.token)
          this.router.navigateByUrl('/')
          if (body.recordar) {
            localStorage.setItem('email', body.email)
          } else {
            localStorage.removeItem('email')
          }
        }
      )
    )
  }
  validarToken(): Observable<boolean> {
    return this.http.get(`${api_url}/auth/renovar`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        this.usuario = resp.usuario
        this.guardarLocalStorage(resp.token);
        return true;
      }),
      catchError(error => of(false))
    );
  }
}
