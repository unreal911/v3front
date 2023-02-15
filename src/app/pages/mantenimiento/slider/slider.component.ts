import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { SliderService } from 'src/app/services/slider.service';
import Swal from 'sweetalert2';
declare var $: any
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  public formSlider: any
  public visiblebtn: boolean = false
  public archivoSubir: any
  public imgTemp: any
  public anchoTemp: number = 0
  public altoTemp: number = 0
  public sliders: any[] = []
  public editar: boolean = false
  public sliderSelecionado: any = {
    titulo: "",
    subtitulo: "",
    botonproducto: {
      textbtn: "",
      urlbtn: "",
      visible: false
    },
    img: {
      secure_url: "",
      public_id: ""
    },
    estado: true,
    uid: ""
  }
  constructor(
    private fb: FormBuilder,
    private sliderService: SliderService,
    private fileUpload: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.formSlider = this.fb.group({
      titulo: ['',],
      subtitulo: ['',],
      botonproducto: this.fb.group({
        textbtn: ['',],
        urlbtn: ['',],
        visible: [false]
      }),
      estado: [true]
    })
    this.listarSlider()
  }

  GuardarCambios() {
    console.log(this.editar)
    if (this.editar) {
      this.ModificarSlider()
    } else {
      this.SubirSlider()
    }
    //hacer condicionales para juntar editar y crear en unsa sola funcion
  }
  editarSlider(slider: any) {
    this.editar = true
    this.sliderSelecionado = slider
    console.log(this.sliderSelecionado.img['secure_url'])
    this.formSlider.setValue({
      titulo: slider.titulo,
      subtitulo: slider.subtitulo,
      botonproducto: {
        textbtn: slider.botonproducto.textbtn,
        urlbtn: slider.botonproducto.urlbtn,
        visible: slider.botonproducto.visible
      },
      estado: slider.estado
    })
    $("#exampleModal").modal("show");
  }
  ModificarSlider() {
    if (this.imgTemp) {
      Swal.fire({
        title: 'Cargando',
        showConfirmButton:false,
        didOpen(popup) {
          Swal.showLoading(
            Swal.getDenyButton()
          );
        },
      })
      this.sliderService.editarSlider(this.sliderSelecionado.uid, this.formSlider.value).subscribe({
        next: (r: any) => {
          console.log(r)
          this.fileUpload.subirArchivoColeccion(r.slider.uid, this.archivoSubir, 'slider').subscribe({
            next: (r) => {
              console.log(r)
              Swal.close()

              $("#exampleModal").modal("hide");
              this.listarSlider()
            },
            error: (e) => {
              console.log(e)
            }
          })
        },
        error: (e) => {
          console.log(e)
        }
      })
    } else {
      console.log(this.sliderSelecionado.uid)
      console.log('Estas en el modificar')
      Swal.fire({
        title: 'Cargando',
        showConfirmButton:false,
        didOpen(popup) {
          Swal.showLoading(
            Swal.getDenyButton()
          );
        },
      })
      this.sliderService.editarSlider(this.sliderSelecionado.uid, this.formSlider.value).subscribe({
        next: (r: any) => {
          console.log(r)
          Swal.close()
          $("#exampleModal").modal("hide");
          this.listarSlider()
        },
        error: (e) => {
          console.log(e)
        }
      })
    }
  }
  abrirModal() {
    this.imgTemp=null
    this.editar = false
    this.sliderSelecionado = {
      titulo: "",
      subtitulo: "",
      botonproducto: {
        textbtn: "",
        urlbtn: "",
        visible: false
      },
      img: {
        secure_url: "",
        public_id: ""
      },
      estado: true,
      uid: ""
    }
    this.formSlider.setValue({
      titulo: '',
      subtitulo: '',
      botonproducto: {
        textbtn: '',
        urlbtn: '',
        visible: false
      },
      estado: true
    })
  }
  cerrarModal() {
    this.imgTemp = null
  }
  listarSlider() {
    this.sliderService.listarSlider().subscribe({
      next: (r: any) => {
        this.sliders = r.sliders
        console.log(r)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  SubirSlider() {
    if (this.imgTemp == null) {
      Swal.fire('Error', 'Necesitas una imagen', 'warning')
      return;
    }
    console.log(this.formSlider.value)
    Swal.fire({
      title: 'Cargando',
      showConfirmButton:false,
      didOpen(popup) {
        Swal.showLoading(
          Swal.getDenyButton()
        );
      },
    })
    this.sliderService.crearSlider(this.formSlider.value).subscribe({
      next: (r: any) => {
        console.log(r)
        this.fileUpload.subirArchivoColeccion(r.slider.uid, this.archivoSubir, 'slider').subscribe({
          next: (r) => {
            Swal.close()
            Swal.fire('Completado','imagen subida con exito','success')
            console.log(r)
            this.listarSlider()
            $("#exampleModal").modal("hide");
          },
          error: (e) => {
            console.log(e)
          }
        })
        //crear la imagen a enviar
      },
      error: (e) => {
        console.log(e)
      }
    })
  }
  cambiarvisible() {
    if (this.formSlider.value.botonproducto.visible == true) {
      return true
    } else {
      return false
    }
  }
  cambiarImagen(evento: any) {
    const archivo = evento.target.files[0];
    this.archivoSubir = evento.target.files[0];
    if (!archivo) {
      this.archivoSubir = null;
      return (this.imgTemp = null);
    }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        this.anchoTemp = img.width;
        this.altoTemp = img.height;
        console.log(`Ancho: ${this.anchoTemp}px, Alto: ${this.altoTemp}px`);
        if (this.anchoTemp === 1920 && this.altoTemp == 930) {
          console.log('Formato aceptado')
          this.imgTemp = reader.result;
        } else {
          Swal.fire('Dimensiones no permitidas', 'requisitos: ANCHO-1920PX X ALTO 930PX', 'warning')
        }
      };
      img.src = reader.result as string;
    };
    return;
  }
  eliminarSlider(slider:any, i: number) {
    Swal.fire({
      title: 'Cargando',
      showConfirmButton:false,
      didOpen(popup) {
        Swal.showLoading(
          Swal.getDenyButton()
        );
      },
    })
    this.sliderService.eliminarSlider(slider).subscribe({
      next: (r) => {
        Swal.close()
        Swal.fire('Completado','imagen subida con exito','success')
        console.log(r)
        this.listarSlider()
        //this.sliders.splice(i, 1)
      }, error: (e) => {
        console.log(e)
      }
    })
  }
}
