import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CortarNombresPipe } from './cortar-nombres.pipe';



@NgModule({
  declarations: [
    CortarNombresPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CortarNombresPipe
  ]
})
export class PipesModule { }
