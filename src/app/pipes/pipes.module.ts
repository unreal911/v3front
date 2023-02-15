import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortarNombresPipe } from './cortar-nombres.pipe';
import { MostrarImgPipe } from './mostrar-img.pipe';
import { ImgSliderPipe } from './img-slider.pipe';



@NgModule({
  declarations: [
    CortarNombresPipe,
    MostrarImgPipe,
    ImgSliderPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CortarNombresPipe,
    MostrarImgPipe,
    ImgSliderPipe
  ]
})
export class PipesModule { }
