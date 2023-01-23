import { Component, OnInit } from '@angular/core';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  public pedidos: any[] = []
  public pedidosTemp: any[] = []
  public mostrarAlerta: boolean = false
  public desde: number = 0
  public totalPedidos: any;
  public cargando: boolean = false
  campoAlfer: any;
  nom: boolean[] = []
  email: boolean[] = []
  telefono: boolean[] = []
  constructor(private busquedaService: BusquedaService,
    private pedidosServices: PedidosService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.listarPedidos()
  }
  buscar(termino: string) {
    // console.log(termino)
    if (termino.length == 0) {
      this.pedidos = this.pedidosTemp
      this.mostrarAlerta = false
      return;
    }
    this.busquedaService.busquedaColeccion(termino, 'usuarios').subscribe({
      next: (r: any) => {
        this.mostrarAlerta = false
        //   console.log(r)
        this.pedidos = r.resultados

        if (r.resultados.length == 0) {
          this.mostrarAlerta = true
        }
      },
      error: (e) => { console.log(e) }
    })
  }
  clickNom(i: number, campo: string, pedido: any) {
    if (campo == 'nombre') {
      this.nom[i] = true
      this.campoAlfer = pedido.nombre
    } else if (campo == 'email') {
      this.email[i] = true
      this.campoAlfer = pedido.email
    } else if (campo == 'telefono') {
      this.telefono[i] = true
      this.campoAlfer = pedido.telefono
    }
  }
  clickSave(x: number, campo: string, pedido: any) {
    if (campo == 'nombre') {
      this.nom[x] = false
      if (pedido.nombre == '') {
        pedido.nombre = this.campoAlfer
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (pedido.nombre == this.campoAlfer) {
        return;
      }
      this.pedidosServices.actualizarPedido(pedido.uid, { nombre: pedido.nombre }).subscribe(
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
      if (pedido.telefono == '') {
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (pedido.telefono == this.campoAlfer) {
        return;
      }
      this.pedidosServices.actualizarPedido(pedido.uid, { correo: pedido.correo }).subscribe(
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
      if (pedido.telefono == '') {
        Swal.fire('Error', 'el campo no puede estar vacio', 'error')
        return;
      }
      if (pedido.telefono == this.campoAlfer) {
        return;
      }
      this.pedidosServices.actualizarPedido(pedido.uid, { telefono: pedido.telefono }).subscribe(
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
    } else if (this.desde >= this.totalPedidos) {
      this.desde -= valor;
    }
    this.listarPedidos();
    this.nom = []
    this.email = []
    this.telefono = []
  }
  listarPedidos() {
    this.cargando = true
    this.pedidosServices.listarPedidos(this.desde, 5).subscribe({
      next: (r: any) => {
        console.log(r.pedidos)
        this.pedidos = r.pedidos
        this.pedidosTemp = r.pedidos
        this.totalPedidos = r.total
        this.cargando = false
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  eliminar(pedido: any) {
    Swal.fire({
      title: 'Estas seguro ?',
      text: `se eliminara a ${pedido.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pedidosServices.eliminar(pedido.uid).subscribe(
          {
            next: (r: any) => {
              console.log(r)
              this.listarPedidos()
              Swal.fire(
                'Elimiado!',
                'El suaurio fue eliminado.',
                'success'
              )
            },
            error: (e: any) => {
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
  cambiarEstado(pedido: any) {
    this.pedidosServices.cambiarEstado(pedido.uid, { estado: pedido.estado }).subscribe(
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
  cambiarPagado(pedido:any){
    this.pedidosServices.cambiarPagado(pedido.uid,{pagado:pedido.pagado}).subscribe({
      next: (r) => {
        console.log(r)
        this.toastr.success('Cambio realizado!!!', 'Se cambio el estado Pagado');
      },
      error: (e) => {
        console.log(e)
        Swal.fire('Error', e.error.msg, 'error')
      }
    })
  }
}
