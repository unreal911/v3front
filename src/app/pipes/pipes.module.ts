import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortarNombresPipe } from './cortar-nombres.pipe';
import { MostrarImgPipe } from './mostrar-img.pipe';



@NgModule({
  declarations: [
    CortarNombresPipe,
    MostrarImgPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CortarNombresPipe,
    MostrarImgPipe
  ]
})
export class PipesModule { }
