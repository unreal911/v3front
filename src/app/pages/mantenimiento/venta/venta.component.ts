import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

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
  public precioSeleccionado: number[] = [];
  public formArray: any
  public cmbProduct: any[] = []
  public formPedido: any
  public submited: boolean = false
  constructor(
    private productoServices: ProductoService,
    private fb: FormBuilder,
    private pedidoService: PedidosService,
    private router:Router
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
    this.submited = true
    console.log(this.formPedido.value)
    console.log(this.formPedido.value.arrayProductos)
    let arrayP = this.formPedido.value.arrayProductos
    for (let i = 0; i < arrayP.length; i++) {
      if (arrayP[i].cantidad < 1) {
        Swal.fire('Formulario Invalido', 'El cantidad no puede ser menor a 1', 'error')
        return;
      }
      if (arrayP[i].precio < 1) {
        Swal.fire('Formulario Invalido', 'El precio no puede ser menor a 1', 'error')
        return;
      }
    }
    if (this.formPedido.invalid) {
      Swal.fire('Formulario Invalido', 'El formulario aun falta completar', 'error')
      return;
    }
    this.pedidoService.crearVentaPedido(this.formPedido.value).subscribe({
      next: (n: any) => {
        console.log(n)
        this.arrayProductos.value.pedido = n.pedido.uid
        console.log(this.arrayProductos.value)
        for (let i = 0; i < this.arrayProductos.value.length; i++) {
          this.arrayProductos.value[i].pedido = n.pedido.uid
          this.pedidoService.crearDetalleVentaPedidoP(this.arrayProductos.value[i]).subscribe({
            next: (r) => {
              console.log(r)
            },
            error: (e) => {
              console.log(e)
            }
          })
        }
          this.router.navigateByUrl('/principal/detallePedido/'+n.pedido.uid)
      },
      error: (e) => {
        console.log(e)
      },
      complete: () => {
        Swal.fire('Boleta realizada', 'Se genero correctamente', 'success')
      }
    })
  }
  getColorClass(productControl: AbstractControl) {
    let valor = productControl.value
    if (typeof valor === 'number') {
      return {
        'is-valid': productControl.valid && !productControl.pristine,
        'is-invalid': productControl.invalid && !productControl.pristine || productControl.value < 1
      };
    } else {
      return {
        'is-valid': productControl.valid && !productControl.pristine,
        'is-invalid': productControl.invalid && !productControl.pristine
      };
    }
  }
  setearPrecio(valor: string, i: number) {
    const productoSeleccionado = this.cmbProduct.find(r => r.uid === valor);
    if (productoSeleccionado) {
      this.precioSeleccionado[i] = productoSeleccionado.precio;
      this.arrayProductos.value[i].precio = productoSeleccionado.precio;
    }
  }
  eliminarFila(i: number) {
    this.arrayProductos.removeAt(i);
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
