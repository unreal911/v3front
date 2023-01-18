import { Component, OnInit } from '@angular/core';
import { TallasService } from 'src/app/services/tallas.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { BusquedaService } from 'src/app/services/busqueda.service';
declare var $: any
@Component({
  selector: 'app-talla',
  templateUrl: './talla.component.html',
  styleUrls: ['./talla.component.css']
})
export class TallaComponent implements OnInit {
  public cargando = false
  public tallas: any[] = []
  public tallasTemp:any[]=[]
  public campoAfter: string = ''
  nom: boolean[] = []
  codigo: boolean[] = []
  desde: number = 0
  public campovalidoNombre: boolean = false
  public campovalidoCodigo: boolean = false
  campoVacioNombre: boolean = false
  campoVacioCodigo: boolean = false
  mostrarAlerta:boolean=false
  constructor(
    private tallaService: TallasService,
    private toastr: ToastrService,
    private busquedaService:BusquedaService) { }

  ngOnInit(): void {
    this.listarTalla()
  }
  crearCategoria(codigo: string, nombre: string) {
    this.campovalidoNombre = false
    this.campovalidoCodigo = false
    if (nombre.length == 0) {
      this.campoVacioNombre = true
      return;
    }
    if (codigo.length == 0) {
      this.campoVacioCodigo = true
      return;
    }
    this.tallaService.crearTalla({ nombre: nombre, codigo: codigo }).subscribe({
      next: (r) => {
        $('#recipient-name').val('')
        $('#recipient-name2').val('')
        $('#exampleModal').modal('hide');
        console.log(r)
        this.listarTalla()
      },
      error: (e) => {
        Swal.fire('Error', e.error.errors[0].msg, 'error')

      }
    })

  }
  close() {
    $('#exampleModal').modal('hide');
    $('#recipient-name').val('')
    $('#recipient-name2').val('')
  }
  listarTalla() {
    this.cargando = true
    this.tallaService.listarTalla().subscribe({
      next: (r: any) => {
        this.tallas = r.tallas
        this.tallasTemp=r.tallas
        this.cargando = false

      },
      error: (e) => { console.log(e) }
    })
  }
  buscar(termino: string) {
    console.log(termino)
    if (termino.length == 0) {
      this.tallas = this.tallasTemp
      this.mostrarAlerta = false
      return;
    }
    this.busquedaService.busquedaColeccion(termino, 'tallas').subscribe({
      next: (r: any) => {
        this.mostrarAlerta = false
        this.tallas = r.resultados
        if (r.resultados.length == 0) {
          this.mostrarAlerta = true
        }
      },
      error: (e) => { console.log(e) }
    })
  }
  clickNom(i: number, campo: string, talla: any) {
    this.nom[i] = true
    this.campoAfter = talla.nombre
  }
  clickSave(x: number, campo: string, talla: any) {
    this.nom[x] = false
    if (talla.nombre == '') {
      Swal.fire('Error', 'el campo no puede estar vacio', 'error')
      talla.nombre = this.campoAfter
      return;

    }
    if (talla.nombre == this.campoAfter) {
      return;
    }
    this.tallaService.actualizarTalla({ nombre: talla.nombre }, talla.uid).subscribe({
      next: (r) => {
        Swal.fire('Bien!', 'Actualizacion exitoza!!', 'success')
      },
      error: (e) => {
        talla.nombre = this.campoAfter
        Swal.fire('Error', e.error.errors[0].msg, 'error')
      }
    })
  }

  clickNomCodigo(i: number, campo: string, talla: any) {
    this.codigo[i] = true
    this.campoAfter = talla.codigo
  }
  clickSaveCodigo(x: number, campo: string, talla: any) {
    console.log(talla)
    this.codigo[x] = false
    if (talla.codigo == '') {
      Swal.fire('Error', 'el campo no puede estar vacio', 'error')
      talla.codigo = this.campoAfter
      return;

    }
    if (talla.codigo == this.campoAfter) {
      return;
    }
    this.tallaService.actualizarTalla({ codigo: talla.codigo }, talla.uid).subscribe({
      next: (r) => {
        Swal.fire('Bien!', 'Actualizacion exitoza!!', 'success')
      },
      error: (e) => {
        talla.codigo = this.campoAfter
        Swal.fire('Error', e.error.errors[0].msg, 'error')
      }
    })
  }

  eliminartalla(talla: any) {
    this.tallaService.eliminarTalla(talla.uid).subscribe({
      next: (r) => {
        console.log(r)
        Swal.fire('Eliminado', 'Se elimino la talla correctamente', 'success')
        this.listarTalla()
      },
      error(e) {
        console.log(e)
      },
    })
  }
  cambiarEstado(talla: any) {
    this.tallaService.actualizarEstadoTalla(talla.estado, talla.uid).subscribe({
      next: (r) => {
        console.log(r)
        this.toastr.success('Cambio realizado!!!', 'Se cambio el estado');
      },
      error: (e) => {

        console.log(e)
      }
    })
  }
}
