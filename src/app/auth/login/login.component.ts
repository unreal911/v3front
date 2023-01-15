import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl(localStorage.getItem('email') || '', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    recordar: new FormControl(false)
  })
  constructor(private usuarioService: UsuarioService) { }
  login() {
    console.log(this.form.value)
    this.usuarioService.login(this.form.value).subscribe({
      next: (r) => {
        console.log(r)
      },
      error: (e) => {
        Swal.fire('Error',e.error.msg,'error')
        console.log(e)
      },
      complete() {

      },
    })
  }
  ngOnInit(): void {
  }

}
