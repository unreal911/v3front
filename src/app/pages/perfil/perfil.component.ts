import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/rpt.listarUsuarios';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public imgTemp: any;
  public usuario: any;
  public campoEmail: boolean = false
  public campoNombre: boolean = false
  public campoTelefono: boolean = false
  public campoAfter: string = ''
  public archivoSubir: any
  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    // this.cargarUsuario()
    this.usuario = this.usuarioService.usuario
    console.log(this.usuario)
  }
  cambiarImagen(evento: any) {
    const archivo = evento.target.files[0];
    this.archivoSubir = evento.target.files[0];
    if (!archivo) {
      this.archivoSubir = null;
      return (this.imgTemp = null);
    }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
    return;
  }
  guardarImagen() {

    Swal.fire({
      title: 'Cargando',
      showConfirmButton:false,
      didOpen(popup) {
        const denyButton = Swal.getDenyButton();
        if (denyButton) {
          Swal.showLoading(denyButton);
        }
      },
    })

    this.usuarioService.surbirImagen(this.usuario, this.archivoSubir).subscribe({
      next: (r) => {
        console.log(r)
        Swal.close()
        Swal.fire('Completado','imagen subida con exito','success')
      },

      error: (e) => { console.log(e) }
    })
  }
  mostrarCampo(usuario: Usuario, campo: string) {
    if (campo == 'email') {
      this.campoEmail = true,
        this.campoAfter = usuario.email
    } else if (campo == 'nombre') {
      this.campoNombre = true
      this.campoAfter = usuario.nombre
    } else if (campo == 'telefono') {
      this.campoAfter = usuario.telefono
      this.campoTelefono = true
      console.log(this.campoTelefono)
    }
  }
  guardarCampo(usuario: Usuario, campo: string) {
    if (campo == 'email') {
      this.campoEmail = false
      if (usuario.email == '') {
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
      }
      if (usuario.email == this.campoAfter) {
        return;
      }
      this.usuarioService.actulizarCampo(usuario.uid, { email: usuario.email }).subscribe({
        next: (r) => {
          console.log(r)
        }, error: (e) => {
          if (!e.error.errors) {
            Swal.fire('Error', e.error.msg, 'error')
          } else {
            Swal.fire('Error', e.error.errors[0].msg, 'error')
          }
        }
      })
    } else if (campo == 'nombre') {
      this.campoNombre = false
      if (usuario.nombre == '') {
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (usuario.nombre == this.campoAfter) {
          usuario.nombre=this.campoAfter //Milton
        return;
      }

      this.usuarioService.actulizarCampo(usuario.uid, { nombre: usuario.nombre }).subscribe({
        next: (r) => {
          console.log(r)
        }, error: (e) => {
          if (!e.error.errors) {
            Swal.fire('Error', e.error.msg, 'error')
          } else {
            Swal.fire('Error', e.error.errors[0].msg, 'error')
          }
        }
      })
    } else if (campo == 'telefono') {
      this.campoTelefono = false
      if (usuario.telefono == '') {
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (usuario.telefono == this.campoAfter) {
        return;
      }
      this.usuarioService.actulizarCampo(usuario.uid, { telefono: usuario.telefono }).subscribe({
        next: (r) => {
          console.log(r)
        }, error: (e) => {
          if (!e.error.errors) {
            Swal.fire('Error', e.error.msg, 'error')
          } else {
            Swal.fire('Error', e.error.errors[0].msg, 'error')
          }
        }
      })
    }
  }
}
