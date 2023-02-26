import { Component, OnInit } from '@angular/core';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { filtrosAgregados } from '../../../interfaces/filtro'
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
  tipoventa = ['SinDefinir', 'VentaWeb', 'VentaGenerada'];
  pagado = [{
    texto: 'PorProcesar',
    valor: false
  },
  {
    texto: 'pagado',
    valor: true
  },
  ]
  filtrosAgregados = {
    pagado: [],
    tipoventa: [],
    rangoFechas: {
      fechaFin: '',
      fechaInicio: ''
    }

  }
  filtroMongo: filtrosAgregados = {
    pagado: {
      $in: []
    },
    tipoventa: {
      $in: []
    },
    fecha: {
      $gte: '',
      $lte: ''
    }
  };
  fechaValor(valor: string, tipofecha: string) {

    if (tipofecha == 'inicio') {
      this.filtroMongo.fecha!.$gte = valor
    } else {
      this.filtroMongo.fecha!.$lte = valor
    }
    console.log(this.filtroMongo)
  }
  ngOnInit(): void {
    this.listarPedidos()
  }
  agregarFiltros(tipoFiltro: string, valor: any) {
    if (tipoFiltro == 'tipoventa') {
      let encontrarFiltros = this.filtroMongo.tipoventa!.$in.find(r => r == valor)
      if (!encontrarFiltros) {
        this.filtroMongo.tipoventa!.$in.push(valor)
      } else {
        //this.filtroMongo.tipoventa?.$in!= this.filtroMongo.tipoventa?.$in.filter(tipo => tipo != valor)
        this.filtroMongo.tipoventa!.$in = this.filtroMongo.tipoventa!.$in.filter(tipo=>tipo!=valor)
      }
    } else if (tipoFiltro == 'pagado') {
      let encontrarFiltros = this.filtroMongo.pagado!.$in.find(r => r == valor)
      if (!encontrarFiltros) {
        this.filtroMongo.pagado!.$in.push(valor)
      } else {
        this.filtroMongo.pagado!.$in = this.filtroMongo.pagado!.$in.filter(tipo => tipo != valor)
      }
    }
    console.log(this.filtroMongo)
  }
  enviarFiltro() {
    //TODO: HACER ESTA CONDICIONAL EN EL BACKEND

 //TODO: falta condicional pagado
    this.busquedaService.getFiltro(this.filtroMongo).subscribe({
      next: (r:any) => {
        this.pedidos=r.filtrarPedido
        console.log(r.filtrarPedido)
      }, error: (e) => {
        console.log(e)
      }
    })
    /* if (this.filtrosAgregados.pagado!.length == 0) {
       delete this.filtrosAgregados.pagado
     }else if(this.filtrosAgregados.rangoFechas?.fechaFin=='' && this.filtrosAgregados.rangoFechas.fechaInicio==''){
       delete this.filtrosAgregados.rangoFechas
     }*/
    //TODO: crear y llamar un servicio que pueda enviar el objeto this.filtrosAgregados
  }
  buscar(termino: string) {
    // console.log(termino)
    if (termino.length == 0) {
      this.pedidos = this.pedidosTemp
      this.mostrarAlerta = false
      return;
    }
    this.busquedaService.busquedaColeccion(termino, 'pedidos').subscribe({
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
          next: (r) => {
            this.toastr.success('Cambio realizado!!!', 'Se cambio el Contenido');
            console.log(r) },
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
          next: (r) => {
            this.toastr.success('Cambio realizado!!!', 'Se cambio el Contenido');
            console.log(r)
          },
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
          next: (r) => {
            this.toastr.success('Cambio realizado!!!', 'Se cambio el Contenido');
            console.log(r) },
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
    }).then((result:any) => {
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
  cambiarPagado(pedido: any) {
    this.pedidosServices.cambiarPagado(pedido.uid, { pagado: pedido.pagado }).subscribe({
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
