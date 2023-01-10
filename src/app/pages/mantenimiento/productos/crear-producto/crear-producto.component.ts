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
  public ListarImg: any[] = []
  cambia: boolean = false
  files: any
  imagenesTemp:any[]=[]
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
  BorrarImg(img:any,i:number){
      console.log(i)
      if(img.id){
        console.log('Hola')
      }else{
        console.log(img.file)
        this.ListarImg.splice(i,1)
      }
  }
  drop(event: CdkDragDrop<string[]>) {
    this.imagenesTemp=this.ListarImg
    //console.log(this.ListarImg)
    //this.toastr.error('Esto no se puede hacer!!!', 'Cambios no realizados');
    moveItemInArray(this.ListarImg, event.previousIndex, event.currentIndex);
    if (this.ListarImg[event.previousIndex].file) {
      // console.log(this.ListarImg[event.previousIndex])
      this.toastr.error('Esto no se puede hacer!!!', 'Cambios no realizados');
      this.cargarProducto(this.id)
      console.log('Hola')
      return;
    } else if (this.ListarImg[event.currentIndex].file) {
      this.toastr.error('Esto no se puede hacer!!!', 'Cambios no realizados');
      this.cargarProducto(this.id)
    }else{
      this.fileUploadService.cambiarPosicion(event.previousIndex, event.currentIndex, this.id).subscribe(
        {
          next: (e) => {
            console.log(e)
            this.cambia = true
            this.toastr.success('Cambio realizado!!!', 'Se cambio la posicion');

          },
          error: (r) => {
            console.log(r)
          },
          complete: () => {
            this.cargarProducto(this.id)
          }
        }
      )
    }
  }
  subir(event: any) {
    // let arrayTemp: any[] = []
    this.files = event.target.files;
    for (const key in this.files) {
      const element = this.files[key];
      // Creamos un objeto Blob a partir del archivo seleccionado
      const blob = new Blob([element], { type: element.type });
      const reader = new FileReader();
      // Leemos el contenido del Blob y obtenemos una URL codificada en base64
      reader.onload = (resp) => {
        let ls = resp.target?.result
        if (!ls?.toString().includes('data:application/octet-stream')) {
          this.ListarImg.push(
            {
              file: element,
              url: ls
            })
        }
      };
      reader.readAsDataURL(blob);
    }

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
