import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/rpt.listarUsuarios';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public usuario: any;
  public campoEmail: boolean = false
  public campoNombre: boolean = false
  public campoTelefono: boolean = false
  public campoAfter: string = ''
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    // this.cargarUsuario()
    this.usuario = this.usuarioService.usuario
  }
  mostrarCampo(usuario: Usuario, campo: string) {
    if (campo == 'email') {
      this.campoEmail = true
    } else if (campo == 'nombre') {
      this.campoNombre = true
    } else if (campo == 'telefono') {
      this.campoTelefono = true
      console.log(this.campoTelefono)
    }

  }
  guardarCampo(usuario:Usuario,campo: string) {
    if (campo == 'email') {
      this.campoEmail = false
    } else if (campo == 'nombre') {
      this.campoNombre = false
    } else if (campo == 'telefono') {
      this.campoTelefono = false
    }
    this.campoEmail=false
  }
}
