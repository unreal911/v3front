import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductoService } from 'src/app/services/producto.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
declare function printArea(): any
declare var $: any
@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {
  public id: any
  public pedido: any
  public detallePedido: any[] = []
  public importeTotal: number = 0
  public producto: any[] = []
  nombreCliente: boolean = false
  direccionCliente: boolean = false
  tempCliente: any
  nombreProducto: boolean[] = []
  cantidadProducto: boolean[] = []
  colorProducto: boolean[] = []
  tallaProducto: boolean[] = []
  precioProducto: boolean[] = []
  aftervalue: any

  @ViewChild('verPdf') verPdf: ElementRef = {} as ElementRef
  stateCtrl = new FormControl('');
  filteredStates: Observable<any[]> = new Observable();

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidosService,
    private productoService: ProductoService,
    private toastr: ToastrService
  ) {
    this.pedido = {}
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!this.id) {
        return;
      }

      this.productoService.listarProducto(0, 100).subscribe((res: any) => {
        this.producto = res.productos;
        this.filteredStates = this.stateCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filterStates(state) : this.producto.slice())),
        );
      });
    });
  }
  private _filterStates(value: string): any[] {
    if (!this.producto || this.producto.length === 0) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.producto.filter(state => state.nombre.toLowerCase().includes(filterValue));//puede que la propiedad no exista
  }

  clickShow(campo: string) {
    console.log(campo)
    if (campo == 'nombre') {
      this.tempCliente = this.pedido.nombre
      this.nombreCliente = true
      console.log(campo)
    } else if (campo == 'direccion') {
      this.tempCliente = this.pedido.direccion
      this.direccionCliente = true
      console.log(campo)
    }

  }
  clickSave(campo: string, valor: any) {
    if (campo == 'nombre') {
      if (this.tempCliente == valor) {
        console.log('son el mismo nombre')
        this.nombreCliente = false
      } else {
        this.nombreCliente = false
        console.log('Se puede cambiar el nombre')
        console.log(valor)
        this.pedidoService.actualizarPedido(this.pedido.uid, { nombre: valor }).subscribe(
          {
            next: (r) => { console.log(r) },
            error: (e) => { console.log(e) }
          }
        )
      }
    } else if (campo == 'direccion') {
      if (this.tempCliente == valor) {
        console.log('son el mismo nombre')
        this.direccionCliente = false
      } else {
        this.direccionCliente = false
        console.log('Se puede cambiar el nombre')
        console.log(valor)
        this.pedidoService.actualizarPedido(this.pedido.uid, { direccion: valor }).subscribe(
          {
            next: (r) => { console.log(r) },
            error: (e) => { console.log(e) }
          }
        )
      }
    }

  }
  clickshowTable(indice: number, valor: string | number, campo: string) {
    if (campo == 'nombre') {
      this.aftervalue = valor
      this.nombreProducto[indice] = true
    } else if (campo == 'color') {
      this.aftervalue = valor
      this.colorProducto[indice] = true
    } else if (campo == 'talla') {
      this.aftervalue = valor
      this.tallaProducto[indice] = true
    } else if (campo == 'cantidad') {
      this.aftervalue = valor
      this.cantidadProducto[indice] = true
    } else if (campo == 'precio') {
      this.aftervalue = valor
      this.precioProducto[indice] = true
    }
  }
  cerrarCombo(i: number) {
    this.nombreProducto[i] = false
  }
  clicksaveTable(uid: string, indice: number, valor: string | number, campo: string) {
    if (campo == 'nombre') {
      this.nombreProducto[indice] = false
      if (valor == this.aftervalue) {
        this.nombreProducto[indice] = false
        console.log('valores inguales no se hara ni un cambio')
        return;
      }
      let afterTempProduc = ''
      this.producto.find(r => {
        if (r.uid == this.aftervalue) {
          afterTempProduc = r.nombre
        }
      })
      let nombreProduc = ''
      this.producto.find(r => {
        if (r.uid == valor) {
          nombreProduc = r.nombre
        }
      })
      Swal.fire({
        title: 'Guardar cambios?',
        text: `se cambiara de : ${afterTempProduc} a  ${nombreProduc} `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.pedidoService.editarDetallePedido(uid, { producto: valor, pedido: this.pedido.uid }).subscribe({
            next: (r) => {
              console.log(r)
              this.cargarDetallePedido()
              Swal.fire(
                'Completado!',
                'Cambio realizado cone exito',
                'success'
              )
            },
            error: (e) => {
              Swal.fire(
                'Error en la accion',
                e,
                'error'
              )
              console.log(e)
            }
          })

        }
      })
    } else if (campo == 'color') {
      if (valor == this.aftervalue) {
        console.log('Los campos son iguales')
        this.colorProducto[indice] = false


        this.toastr.info('Cambios no realizados', 'Info Color');
        return;
      }
      if (valor.toString().length == 0 || valor.toString().trim() == '') {
        this.toastr.error('El campo no puede estar vacio ni nulo', 'Info Color');
        this.detallePedido[indice].color = this.aftervalue
        this.colorProducto[indice] = false
        return;
      }
      this.colorProducto[indice] = false
      let obj: any = {};
      Object.defineProperty(obj, campo, {
        value: valor,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      obj.pedido = this.pedido.uid
      this.pedidoService.editarDetallePedido(uid, obj).subscribe({
        next: (r) => {
          this.toastr.success('Cambios realizados', 'Info Color');
          console.log(r)
        },
        error: (e) => { console.log(e) }
      })


    } else if (campo == 'talla') {

      if (valor == this.aftervalue) {
        console.log('Los campos son iguales')
        this.tallaProducto[indice] = false


        this.toastr.info('Cambios no realizados', 'Info talla');
        return;
      }
      if (valor.toString().length == 0 || valor.toString().trim() == '') {
        this.toastr.error('El campo no puede estar vacio ni nulo', 'Info talla');
        this.detallePedido[indice].talla = this.aftervalue
        this.tallaProducto[indice] = false
        return;
      }
      this.tallaProducto[indice] = false
      let obj: any = {};
      Object.defineProperty(obj, campo, {
        value: valor,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      obj.pedido = this.pedido.uid
      this.pedidoService.editarDetallePedido(uid, obj).subscribe({
        next: (r) => {
          this.toastr.success('Cambios realizados', 'Info talla');
          console.log(r)
        },
        error: (e) => { console.log(e) }
      })


    } else if (campo == 'cantidad') {
      if (valor == this.aftervalue) {
        this.toastr.info('No hay cambios', 'Info cantidad');
        this.cantidadProducto[indice] = false
        return;
      }
      if (valor <= 0) {
        this.detallePedido[indice].cantidad = this.aftervalue
        this.toastr.error('La cantidad no puede ser menor o igual a 0', 'Info cantidad');
        return;
      }
      this.cantidadProducto[indice] = false
      let obj: any = {};
      Object.defineProperty(obj, campo, {
        value: valor,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      obj.pedido = this.pedido.uid
      this.pedidoService.editarDetallePedido(uid, obj).subscribe({
        next: (r: any) => {
          this.toastr.success('Se cambio la cantidad con exito', 'Cantidad Info');
          this.detallePedido[indice].subtotal = this.detallePedido[indice].precio * obj.cantidad
          this.importeTotal = this.detallePedido.reduce((acc, obj) => acc + obj.subtotal, 0);
          console.log(r)
        },
        error: (e) => { console.log(e) }
      })


    } else if (campo == 'precio') {
      if (valor == this.aftervalue) {
        this.toastr.info('No hay cambios', 'Info cantidad');
        this.precioProducto[indice] = false
        return;
      }
      if (valor <= 0) {
        this.detallePedido[indice].precio = this.aftervalue
        this.toastr.error('el precio no puede ser menor o igual a 0', 'Info precio');
        return;
      }
      this.precioProducto[indice] = false
      let obj: any = {};
      Object.defineProperty(obj, campo, {
        value: valor,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      obj.pedido = this.pedido.uid
      this.pedidoService.editarDetallePedido(uid, obj).subscribe({
        next: (r: any) => {
          this.detallePedido[indice].subtotal = this.detallePedido[indice].cantidad * obj.precio
          this.importeTotal = this.detallePedido.reduce((acc, obj) => acc + obj.subtotal, 0);
          this.toastr.success('Se cambio precio con exito', 'precio Info');
          console.log(r)
        },
        error: (e) => { console.log(e) }
      })


    }


  }
  ngOnInit(): void {

    this.cargarpedido()
    this.cargarDetallePedido(),

      printArea()
  }
  cargarpedido() {
    this.pedidoService.PedidoID(this.id).subscribe({
      next: (r: any) => {
        console.log(r)
        this.pedido = r.pedido
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
  cargarDetallePedido() {
    this.pedidoService.listarDetallePorPedido(this.id, 0, 100).subscribe({
      next: (r: any) => {
        console.log(r)
        this.detallePedido = r.DetallePedidos
        this.importeTotal = this.detallePedido.reduce((acc, obj) => acc + obj.subtotal, 0);
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
  cargarProducto() {
    this.productoService.listarProducto(0, 100).subscribe({
      next: (r) => {
        this.producto = r.productos
        console.log(r)
      },
      error: (e) => {
        console.log(e)
      },
    })
  }
  lanzarPrint() {

    $("#print").click(function () {
      var mode = 'iframe'; //popup
      var close = mode == "popup";
      var options = {
        mode: mode,
        popClose: close
      };
      $("div.printableArea").printArea(options);
    });
  }

}
