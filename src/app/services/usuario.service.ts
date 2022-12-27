import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { login } from '../interfaces/login.interfase';
import { Login } from '../interfaces/rpt.login.interface';
const api_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient, private router: Router) { }

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
}
