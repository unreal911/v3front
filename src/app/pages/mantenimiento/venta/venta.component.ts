import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  public productos: any[] = [{
    nombre: '',
    talla: '',
    color: '',
    cantidad: 0,
    precio: 0
  }]
  public formArray: any
  public cmbProduct: any[] = []
  public formPedido: any
  constructor(
    private productoServices: ProductoService,
    private fb: FormBuilder,
    private pedidoService: PedidosService
  ) { }
  ngOnInit(): void {
    this.listarProductos()
    this.formPedido = this.fb.group({
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      tipoventa: ['VentaGenerada'],
      arrayProductos: this.fb.array([

      ])
    })
  }
  get arrayProductos(): FormArray {
    return this.formPedido.get('arrayProductos') as FormArray;
  }
  GenerarPedido() {
    console.log(this.formPedido.valid)
    this.pedidoService.crearVentaPedido(this.formPedido.value).subscribe({
      next: (n: any) => {
        console.log(n)
        this.arrayProductos.value.pedido = n.pedido.uid
        console.log(this.arrayProductos.value)
        for (let i = 0; i < this.arrayProductos.value.length; i++) {
          const element = this.arrayProductos.value[i];
          this.arrayProductos.value[i].pedido=n.pedido.uid
          this.pedidoService.crearDetalleVentaPedido(this.arrayProductos.value[i]).subscribe({
            next: (r) => {
              console.log(r)
            },
            error: (e) => {
              console.log(e)
            }
          })
        }
      },
      error: (e) => {
        console.log(e)
      }
    })
  }

  getColorClass(productControl: AbstractControl) {
    return {
      'is-valid': productControl.valid && !productControl.pristine,
      'is-invalid': productControl.invalid && !productControl.pristine
    };
  }
  listarProductos() {
    this.productoServices.listarProducto(0, 100).subscribe({
      next: (r) => {
        this.cmbProduct = r.productos
        console.log(r)
      },
      error: (e) => { console.log(e) }
    })
  }
  validarCampo(nombre: string) {
    if (this.formPedido.get(nombre)?.pristine == false && this.formPedido.get(nombre)?.valid == true) {
      return true
    } else {
      return false
    }
  }
  campoIncorrecto(campo: string) {
    if (this.formPedido.get(campo)?.pristine == false && this.formPedido.get(campo)?.invalid == true) {
      return true
    } else {
      return false
    }
  }
  addProducto() {
    this.arrayProductos.push(this.fb.group({
      producto: ['', [Validators.required]],
      color: ['', [Validators.required]],
      talla: ['', [Validators.required]],
      cantidad: [0, [Validators.required]],
      precio: [0, [Validators.required]],
    }))
    console.log(this.productos)
  }
}
