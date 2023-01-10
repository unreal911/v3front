import { Component, OnInit } from '@angular/core';
import { Categoria, listarCategoria } from 'src/app/interfaces/rpt.listar.categorias';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Img, ListarProducto, Producto } from 'src/app/interfaces/rpt.listarProducto';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  public ListaCategoria: Categoria[] = []
  public id: any
  public Producto: any
  public ListarImg: Img[] = []
  cambia: boolean = false
  constructor(private categoriaServices: CategoriaService,
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private fileUploadService: FileUploadService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.listarCategorias()
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!this.id) {
        return;
      }
      this.cargarProducto(this.id)
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ListarImg, event.previousIndex, event.currentIndex);
    this.fileUploadService.cambiarPosicion(event.previousIndex, event.currentIndex, this.id).subscribe(
      {
        next: (e) => {
          console.log(e)
          this.cambia = true
          this.toastr.success('Cambio realizado!!!', 'Se cambio la posicion');
          this.cargarProducto(this.id)
        },
        error: (r) => {
          console.log(r)
        },
        complete: () => {
        }
      }
    )
  }
  
  cargarProducto(uid: string) {
    this.productoService.ProductoId(uid).subscribe(
      {
        next: (r) => {
          this.Producto = r.producto
          this.ListarImg = r.producto.img
          console.log(this.ListarImg)
          console.log(this.Producto)
        },
        error: (e) => { console.log(e) }
      }
    )
  }
  listarCategorias() {
    this.categoriaServices.listarCategoria(0, 100).subscribe({
      next: (r: listarCategoria) => {
        this.ListaCategoria = r.categorias
        console.log(this.ListaCategoria)
      },
      error: (e) => { console.log(e) }
    })
  }

}
