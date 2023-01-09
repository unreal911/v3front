import { Component, OnInit } from '@angular/core';
import { Categoria, listarCategoria } from 'src/app/interfaces/rpt.listar.categorias';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  public categorias: Categoria[] = []
  public total: number = 0
  nom: boolean[] = []
  public campoAfter: any
  constructor(private categoriaServices: CategoriaService) { }

  ngOnInit(): void {
    this.listarCategoria()
  }
  cambiarEstado(){
    //falta hacer el servicio de adminsitrar estado/eliminar
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
    this.categoriaServices.listarCategoria(0, 5).subscribe({
      next: (r) => {
        this.categorias = r.categorias
        this.total = r.total
        console.log(r)
      },
      error: (e) => { console.log(e) }
    })
  }

}
