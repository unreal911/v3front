import { Component, OnInit, ViewChild } from '@angular/core';
import { Categoria, listarCategoria } from 'src/app/interfaces/rpt.listar.categorias';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { TallasService } from 'src/app/services/tallas.service';
@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  public ListaCategoria: Categoria[] = []
  public id: any
  public Producto: any;
  public ListarImg: any[] = []
  public listarTallas: any[] = []
  public tallasdisponibles: any[] = []
  cambia: boolean = false
  files: any
  imagenesTemp: any[] = []
  imagenesbolean: boolean[] = []
  @ViewChild('fileInput') fileInput: any;
  public prductoForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    disponible: new FormControl(false),
    descripcion: new FormControl('')

  })
  constructor(private categoriaServices: CategoriaService,
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private fileUploadService: FileUploadService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private tallaService: TallasService
  ) {


  }
  borrarTalla(i:number){
    this.tallasdisponibles.splice(i,1)
  }
  agregarTalla(talla: any) {
    console.log(talla)
    if(this.tallasdisponibles.includes(talla)){
      console.log('Ya tiene esta lla')
    }else {
      this.tallasdisponibles.push(talla)
      console.log(this.tallasdisponibles)
    }
  }
  listarTalla() {
    this.tallaService.listarTalla().subscribe({
      next: (r: any) => {
        this.listarTallas = r.tallas
      }
    })
  }
  EditarProducto() {

    if (!this.prductoForm.valid) {
      Swal.fire('Error!!', 'Falta llenar campos', 'error')
      return;
    }
    if (this.Producto.nombre == this.prductoForm.value.nombre) {
      delete this.prductoForm.value.nombre
    }
    this.prductoForm.value.talla=this.tallasdisponibles
    if(this.prductoForm.value.talla.length==0){
      this.toastr.error('seleccione al menos una talla!!!', 'Cambios no realizados!!!');
      return;
    }
    this.productoService.editarProducto(this.prductoForm.value, this.Producto.uid).subscribe({
      next: (r) => {
        console.log(r)
        this.cargarProducto(this.id)
        this.toastr.success('Se actualizo correctamente!!!', 'Cambios realizados');
      },
      error: (e) => {
        Swal.fire('Error!!', e.error.errors[0].msg, 'error')
        console.log(e)

      }
    })

  }
  validarCampo(nombre: string) {
    if (this.prductoForm.get(nombre)?.pristine == false && this.prductoForm.get(nombre)?.valid == true) {
      return true
    } else {
      return false
    }
  }
  campoIncorrecto(campo: string) {
    if (this.prductoForm.get(campo)?.pristine == false && this.prductoForm.get(campo)?.invalid == true) {
      return true
    } else {
      return false
    }
  }
  guardarImagen(i: number) {

    Swal.fire({
      title: 'Cargando',
      showConfirmButton: false,
      didOpen(popup) {
        Swal.showLoading(
          Swal.getDenyButton()
        );
      },
    })

    console.log(i)
    this.fileUploadService.subirArchivo(this.id, this.ListarImg[i].file, 'productos').subscribe(
      {
        next: (r: any) => {
          //   this.ListarImg[i].estado=false
          this.ListarImg[i] = r.producto.img[i]
          console.log(this.ListarImg)
          console.log(r)
          Swal.close()
          Swal.fire('Completado', 'imagen subida con exito', 'success')
        },
        error: (e) => { console.log(e) }

      }
    )
    this.ListarImg
  }
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (!this.id) {
        return;
      }
      this.cargarProducto(this.id)
    });


    this.listarCategorias()
    this.listarTalla()
  }
  guardarProducto() {
    if (!this.prductoForm.valid) {
      Swal.fire('Error!!', 'Falta llenar campos', 'error')
      return;
    }

    this.prductoForm.value.talla=this.tallasdisponibles
    if(this.prductoForm.value.talla.length==0){
      this.toastr.success('seleccione al menos una talla!!!', 'Cambios no realizados!!!');
      return;
    }
    this.productoService.crearProducto(this.prductoForm.value).subscribe({
      next: (r: any) => {
        console.log(r)
        this.router.navigateByUrl(`/principal/producto/${r.producto.uid}`)
      },
      error: (e) => {
        Swal.fire('!!Error', `${e.error.errors[0].msg}`, 'error')
        console.log(e)
      }
    })

  }
  BorrarImg(img: any, i: number) {
    console.log(i)
    if (img.id) {
      Swal.fire({
        title: 'Cargando',
        showConfirmButton: false,
        didOpen(popup) {
          Swal.showLoading(
            Swal.getDenyButton()
          );
        },
      })
      this.fileUploadService.eliminarArchivo(this.id, this.ListarImg[i].id).subscribe({
        next: (r) => {
          console.log(r)
          this.ListarImg.splice(i, 1)
          Swal.close()
          Swal.fire('Completado', 'imagen eliminada', 'success')
        },
        error: (e) => { console.log(e) }
      })
      console.log('Hola')
    } else {
      console.log(img.file)
      this.ListarImg.splice(i, 1)
      if (this.fileInput && this.fileInput.nativeElement) {
        // Resetea el elemento <input type="file">
        this.fileInput.nativeElement.value = '';
      }
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    this.imagenesTemp = this.ListarImg
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
    } else {
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
              url: ls,
              estado: false
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
          console.log(r)
          this.Producto = r.producto
          this.ListarImg = r.producto.img
          this.tallasdisponibles=r.producto.talla
          this.prductoForm.setValue({
            nombre: r.producto.nombre,
            categoria: r.producto.categoria,
            precio: r.producto.precio,
            descripcion: r.producto.descripcion,
            disponible: r.producto.disponible
          })

        },
        error: (e) => { console.log(e) },
        complete() {

        },
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
