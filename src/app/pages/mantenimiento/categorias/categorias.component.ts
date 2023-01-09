import { Component, OnInit } from '@angular/core';
import { Categoria, listarCategoria } from 'src/app/interfaces/rpt.listar.categorias';
import { Usuario } from 'src/app/interfaces/rpt.listarUsuarios';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  public categorias: Categoria[] = []
  public total: number = 0
  nom: boolean[] = []
  public campovalido: boolean = false
  public campoAfter: any
  categoriasTemp: Categoria[] = []
  mostrarAlerta: boolean = false
  constructor(private categoriaServices: CategoriaService,
    private busquedaService: BusquedaService,
    private toastr: ToastrService
    ) { }
  desde: number = 0
  cargando: boolean = false
  campoVacio:boolean=false
  ngOnInit(): void {
    this.listarCategoria()
  }
  buscar(termino: string) {
    console.log(termino)
    if (termino.length == 0) {
      this.categorias = this.categoriasTemp
      this.mostrarAlerta = false
      return;
    }
    this.busquedaService.busquedaColeccion(termino, 'categorias').subscribe({
      next: (r: any) => {
        this.mostrarAlerta = false
        this.categorias = r.resultados
        if (r.resultados.length == 0) {
          this.mostrarAlerta = true
        }
      },
      error: (e) => { console.log(e) }
    })
  }
  crearCategoria(nombre: string) {
    this.campovalido = false
    if(nombre.length==0){
      this.campoVacio=true
      return;
    }
    this.categoriaServices.crearCategoria(nombre).subscribe({
      next: (r) => {
        $('#recipient-name').val('')

        $('#exampleModal').modal('hide');
        console.log(r)
        this.listarCategoria()
      },
      error: (e) => {
         console.log(e)
         this.campoVacio=false
         this.campovalido = true
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
    this.listarCategoria();
    this.nom = []
  }
  eliminarCategoria(categoria: Categoria) {

    Swal.fire({
      title: 'Estas seguro ?',
      text: `se eliminara a ${categoria.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaServices.eliminarCategoria(categoria).subscribe(
          {
            next: (r) => {
              console.log(r)
              this.listarCategoria()
              Swal.fire(
                'Elimiado!',
                'Se se elimino categoria',
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
  cambiarEstado(categoria: Categoria) {
    this.categoriaServices.actualizarEstado(categoria).subscribe({
      next: (r) => { console.log(r)
        this.toastr.success('Cambio realizado!!!', 'Se cambio el estado');
      },
      error: (e) => {

        console.log(e)
      }
    })
  }
  clickNom(i: number, campo: string, categoria: Categoria) {
    this.nom[i] = true
    this.campoAfter = categoria.nombre
  }
  clickSave(x: number, campo: string, categoria: Categoria) {
    this.nom[x] = false
    if (categoria.nombre == '') {
      Swal.fire('Error', 'el campo no puede estar vacio', 'error')
      categoria.nombre = this.campoAfter
      return;

    }
    if (categoria.nombre == this.campoAfter) {
      return;
    }
    this.categoriaServices.ActualizarCategoria(categoria).subscribe({
      next: (r) => {
        Swal.fire('Bien!', 'Actualizacion exitoza!!', 'success')
      },
      error: (e) => {
        categoria.nombre = this.campoAfter
        Swal.fire('Error', e.error.errors[0].msg, 'error')
      }
    })
  }
  listarCategoria() {
    this.cargando = true
    this.categoriaServices.listarCategoria(this.desde, 5).subscribe({
      next: (r) => {
        this.categorias = r.categorias
        this.total = r.total
        this.categoriasTemp = r.categorias
        this.cargando = false
      },
      error: (e) => { console.log(e) }
    })
  }

}
