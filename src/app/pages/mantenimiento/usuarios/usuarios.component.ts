import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListarUsuarios, Usuario } from 'src/app/interfaces/rpt.listarUsuarios';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private usuarioService: UsuarioService,
    private busquedaService: BusquedaService,
    private toastr: ToastrService) { }
  getInput: boolean = false
  campo: any;
  nom: boolean[] = []
  email: boolean[] = []
  telefono: boolean[] = []
  totalUsuarios: any
  desde: number = 0
  campoAlfer: string = ''
  public usuarios: Usuario[] = []
  public usuariosTemp: Usuario[] = []
  cargando: boolean = false
  mostrarAlerta: boolean = false
  ngOnInit(): void {
    this.listarUsuarios()
  }
  buscar(termino: string) {
    // console.log(termino)
    if (termino.length == 0) {
      this.usuarios = this.usuariosTemp
      this.mostrarAlerta = false
      return;
    }
    this.busquedaService.busquedaColeccion(termino, 'usuarios').subscribe({
      next: (r: any) => {
        this.mostrarAlerta = false
        //   console.log(r)
        this.usuarios = r.resultados

        if (r.resultados.length == 0) {
          this.mostrarAlerta = true
        }
      },
      error: (e) => { console.log(e) }
    })
  }
  eliminar(usuario: Usuario) {
    Swal.fire({
      title: 'Estas seguro ?',
      text: `se eliminara a ${usuario.email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (usuario.uid == this.usuarioService.usuario.uid) {

          Swal.fire(
            'Cuidado!',
            'No te puedes eliminar a ti mismo.',
            'info'
          )
          return;
        }
        this.usuarioService.eliminar(usuario.uid).subscribe(
          {
            next: (r) => {
              console.log(r)
              this.listarUsuarios()
              Swal.fire(
                'Elimiado!',
                'El suaurio fue eliminado.',
                'success'
              )
            },
            error: (e) => {
              console.log(e)
              Swal.fire(
                'Info!',
                e.error.msg,
                'error'
              )
            }
          }
        )

      }
    })
  }
  cambiarEstado(usuario: Usuario) {
    if (this.usuarioService.usuario.uid == usuario.uid) {
      Swal.fire('Cuidado', 'No puedes cambiar estado a ti mismo', 'info')
      return;
    }
    this.usuarioService.cambiarEstado(usuario).subscribe(
      {
        next: (r) => {
          console.log(r)
          this.toastr.success('Cambio realizado!!!', 'Se cambio el estado');
        },
        error: (e) => {
          console.log(e)
          Swal.fire('Error', e.error.msg, 'error')
        }
      }
    )
  }
  cambiarRol(usuario: Usuario) {
    if (this.usuarioService.usuario.uid == usuario.uid) {
      Swal.fire('Cuidado', 'No puedes cambiar rol a ti mismo', 'info')
      return;
    }
    this.usuarioService.cambiaRol(usuario).subscribe(
      {
        next: (r) => {
          console.log(r)
          this.toastr.success('Cambio realizado!!!', 'Se cambio el rol ');
        },
        error: (e) => {
          console.log(e)
          if (e.error.msg) {
            Swal.fire('Error', e.error.msg, 'error')
          } else {
            Swal.fire('Error', e.error.errors[0].msg, 'error')
          }

        }
      }
    )
  }
  clickNom(i: number, campo: string, usuario: Usuario) {
    if (campo == 'nombre') {
      this.nom[i] = true
      this.campoAlfer = usuario.nombre
    } else if (campo == 'email') {
      this.email[i] = true
      this.campoAlfer = usuario.email
    } else if (campo == 'telefono') {
      this.telefono[i] = true
      this.campoAlfer = usuario.telefono
    }
  }
  clickSave(x: number, campo: string, usuario: Usuario) {
    if (campo == 'nombre') {
      this.nom[x] = false
      if (usuario.nombre == '') {
        usuario.nombre = this.campoAlfer
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (usuario.nombre == this.campoAlfer) {
        return;
      }
      this.usuarioService.actulizarCampo(usuario.uid, { nombre: usuario.nombre }).subscribe(
        {
          next: (r) => { console.log(r) },
          error: (e) => {
            if (!e.error.errors) {
              Swal.fire('Error', e.error.msg, 'error')
            } else {
              Swal.fire('Error', e.error.errors[0].msg, 'error')
            }
          }
        },
      )
    } else if (campo == 'email') {
      this.email[x] = false
      if (usuario.email == '') {
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (usuario.email == this.campoAlfer) {
        return;
      }
      this.usuarioService.actulizarCampo(usuario.uid, { email: usuario.email }).subscribe(
        {
          next: (r) => { console.log(r) },
          error: (e) => {
            if (!e.error.errors) {
              Swal.fire('Error', e.error.msg, 'error')
            } else {
              Swal.fire('Error', e.error.errors[0].msg, 'error')
            }
          }
        },
      )
    } else if (campo == 'telefono') {
      this.telefono[x] = false
      if (usuario.telefono == '') {
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (usuario.telefono == this.campoAlfer) {
        return;
      }
      this.usuarioService.actulizarCampo(usuario.uid, { telefono: usuario.telefono }).subscribe(
        {
          next: (r) => { console.log(r) },
          error: (e) => {
            if (!e.error.errors) {
              Swal.fire('Error', e.error.msg, 'error')
            } else {
              Swal.fire('Error', e.error.errors[0].msg, 'error')
            }
          }
        },
      )
    }
  }
  cambiarPagina(valor: number) {
    this.desde += valor;
    console.log(this.desde)
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.listarUsuarios();
    this.nom = []
    this.email = []
    this.telefono = []
  }
  listarUsuarios() {
    this.cargando = true
    this.usuarioService.listarUsuarios(this.desde, 5).subscribe({
      next: (r) => {
        console.log(r.usuarios)
        this.usuarios = r.usuarios
        this.usuariosTemp = r.usuarios
        this.totalUsuarios = r.total
        this.cargando = false
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
}
