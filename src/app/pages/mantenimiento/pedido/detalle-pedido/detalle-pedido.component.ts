import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductoService } from 'src/app/services/producto.service';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

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
  @ViewChild('verPdf') verPdf: ElementRef = {} as ElementRef
  stateCtrl = new FormControl('');
  filteredStates: Observable<any[]> = new Observable();

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidosService,
    private productoService: ProductoService
  ) {
    this.pedido = {}
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!this.id) {
        return;
      }

      this.productoService.listarProducto(0, 10).subscribe((res: any) => {
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
