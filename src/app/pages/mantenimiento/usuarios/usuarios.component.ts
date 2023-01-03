import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListarUsuarios, Usuario } from 'src/app/interfaces/rpt.listarUsuarios';

import { UsuarioService } from 'src/app/services/usuario.service';
declare var $: any
import Swal from 'sweetalert2'
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
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
  getInput: boolean = false
  campo: any;
  laberSeleccionado: any;
  public usuarios: Usuario[] = []
  ngOnInit(): void {
    this.listarUsuarios()

  }
  listarUsuarios() {
    this.usuarioService.listarUsuarios().subscribe({
      next: (r) => {
        console.log(r.usuarios)
        this.usuarios = r.usuarios
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

}
