import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TallasService } from 'src/app/services/tallas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  public cargando: boolean = false
  public productos: any[] = []
  public productosTemp: any[] = []
  public total: number = 0
  public listarTallas:any[]=[]
  mostrarAlerta: boolean = false
  desde: number = 0
  constructor(
    private busquedaService: BusquedaService,
    private productoService: ProductoService,
    private toastr: ToastrService,
    private tallaService:TallasService
  ) { }

  ngOnInit(): void {
    this.listarProductos()

  }


  buscar(termino: string) {
    console.log(termino)
    if (termino.length == 0) {
      this.productos = this.productosTemp
      this.mostrarAlerta = false
      return;
    }
    this.busquedaService.busquedaColeccion(termino, 'productos').subscribe({
      next: (r: any) => {
        this.mostrarAlerta = false
        this.productos = r.resultados
        if (r.resultados.length == 0) {
          this.mostrarAlerta = true
        }
      },
      error: (e) => { console.log(e) }
    })
  }
  editarDisponible(producto: any) {
    this.productoService.editarDisponible(producto.uid, { disponible: producto.disponible }).subscribe({
      //crear otro servicio
      next: (r) => {
        console.log(r)
        this.toastr.success('Cambio realizado!!!', 'Se cambio el disponible');
      }, error(e) {
        console.log(e)
      },
    })
  }
  eliminarProducto(producto: any) {

    Swal.fire({
      title: 'Estas seguro ?',
      text: `se eliminara a ${producto.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(producto.uid).subscribe(
          {
            next: (r) => {
              console.log(r)
              this.listarProductos()
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
  cambiarPagina(valor: number) {
    this.desde += valor;
    console.log(this.desde)
    if (this.desde < 0) {
      this.desde = 0;
      return;
    } else if (this.desde >= this.total) {
      this.desde -= valor;
      return;
    }
    this.listarProductos();
    //   this.nom = []
  }
  listarProductos() {
    this.cargando = true
    this.productoService.listarProducto(this.desde, 5).subscribe({
      next: (r) => {

        this.productos = r.productos
        this.total = r.total
        this.productosTemp = r.productos
        this.cargando = false
      },
      error: (e) => { console.log(e) }
    })
  }
}
