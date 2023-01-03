import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    password2: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    rol: new FormControl('VENTAS_ROL', Validators.required)
  })
  estado: any
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }
  registrarUsuario() {
    if (this.registerForm.invalid) {
      console.log('No hay submited')
      return;
    }
    if (this.registerForm.valid && this.passValidas() == true) {
      return;
    }
    console.log(this.registerForm.value)
    this.usuarioService.crearusuario(this.registerForm.value).subscribe(
      {
        next: (r) => {
          Swal.fire({
            title: 'Usuario Creado!',
            text: 'La operacion se realizo correctamente',
            icon: 'success',
            confirmButtonText: 'Ok!'
          })
            this.registerForm.reset()
        },
        error(e) {
          Swal.fire({
            title: 'Error!',
            text: e.error.errors[0].msg,
            icon: 'error',
            confirmButtonText: 'Ok!'
          })
          console.log(e.error.errors[0].msg)
        },
        complete() { },
      }
    )

  }
  passmsg() {
    if (this.passValidas() == true && this.registerForm.get('password2')?.touched == true && this.registerForm.get('password2')?.pristine == false) {
      return true
    } else {
      return false
    }
  }
  passValidas() {
    const pass1 = this.registerForm.get('password')?.value
    const pass2 = this.registerForm.get('password2')?.value
    //   if(this.registerForm.get())
    if (pass1 != pass2) {
      return true
    } else {
      return false
    }
  }
  validarCampo(nombre: string) {
    if (this.registerForm.get(nombre)?.pristine == false && this.registerForm.get(nombre)?.valid == true) {
      return true
    } else {
      return false
    }
  }
  campoIncorrecto(campo: string) {
    if (this.registerForm.get(campo)?.pristine == false && this.registerForm.get(campo)?.invalid == true) {
      return true
    } else {
      return false
    }
  }
  //falta validar Contraseñas
  verestado() {
    return this.estado = {
      formularioValido: this.registerForm.valid,
      pristine: this.registerForm.get('password2')?.pristine,
      touched: this.registerForm.get('password2')?.touched,
      valido: this.registerForm.get('password2')?.valid
    }
  }
}
