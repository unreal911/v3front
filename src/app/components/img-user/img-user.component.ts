import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-img-user',
  templateUrl: './img-user.component.html',
  styleUrls: ['./img-user.component.css']
})
export class ImgUserComponent implements OnInit {
  @Input() usuario: any;
  @Input() ancho:any;
  public archivoSubir: any
  public imgTemp: any
  constructor() { }

  ngOnInit(): void {
    console.log(this.usuario)
  }
  cambiarImagen(evento: any) {
    console.log(this.usuario)
    const archivo = evento.target.files[0];
    this.archivoSubir = evento.target.files[0];
    if (!archivo) {
      this.archivoSubir = null;
      return (this.imgTemp = null);
    }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(archivo);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
    //this.usuario=null
    return;
  }

}
