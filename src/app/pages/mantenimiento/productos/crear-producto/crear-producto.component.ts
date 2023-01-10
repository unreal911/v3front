import { Component, OnInit } from '@angular/core';
import { Categoria, listarCategoria } from 'src/app/interfaces/rpt.listar.categorias';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Img, ListarProducto, Producto } from 'src/app/interfaces/rpt.listarProducto';
@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  public ListaCategoria: Categoria[] = []
  public id: any
  public Producto:any
  public ListarImg:Img[]=[]
  constructor(private categoriaServices: CategoriaService,
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.listarCategorias()
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if(!this.id){
        return;
      }
      this.cargarProducto(this.id)
    });
  }
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century',
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ListarImg, event.previousIndex, event.currentIndex);
  }
  cargarProducto(uid: string) {
    this.productoService.ProductoId(uid).subscribe(
      {
        next: (r) => {
            this.Producto=r.producto
            this.ListarImg=r.producto.img
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
